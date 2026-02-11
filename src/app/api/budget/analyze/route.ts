import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";
import { analyzeBudgetStream, stripForFreeUser, type BudgetAnalysisInput, type AnalysisOutput } from "@/lib/claude-budget";

export const maxDuration = 60;

const rateLimit = new Map<string, number[]>();
const WINDOW_MS = 3600_000; // 1 hour
const MAX_PREMIUM = 3;

function isRateLimited(userId: string, isPremium: boolean): boolean {
  if (!isPremium) return false; // free users are limited by free_analysis_used flag
  const now = Date.now();
  const timestamps = rateLimit.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PREMIUM) return true;
  recent.push(now);
  rateLimit.set(userId, recent);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const token = getAccessToken(request.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user profile
    const supabase = createSupabaseClient(token);
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, free_analysis_used")
      .eq("id", user.id)
      .single();

    const isPremium = profile?.subscription_status === "premium";

    // Check free user limit
    if (!isPremium && profile?.free_analysis_used) {
      return NextResponse.json(
        { error: "Free analysis already used. Upgrade to premium for unlimited analyses.", isLocked: true },
        { status: 403 }
      );
    }

    // Check rate limit for premium users
    if (isRateLimited(user.id, isPremium)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 3 analyses per hour." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const input: BudgetAnalysisInput = {
      monthlyBudget: Number(body.monthlyBudget) || 100,
      currentSpending: Array.isArray(body.currentSpending) ? body.currentSpending : [],
      primaryGoal: body.primaryGoal || "lifespan",
      ageRange: body.ageRange,
    };

    // Use streaming to avoid Vercel timeout
    const stream = await analyzeBudgetStream(input);

    // Collect the full streamed response
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const decoder = new TextDecoder();
    const rawText = chunks.map((c) => decoder.decode(c)).join("").trim();

    // The stream sends spaces as keep-alive then the JSON at the end
    // Extract the JSON part (last occurrence of { to })
    const jsonStart = rawText.lastIndexOf('{"');
    if (jsonStart === -1) {
      return NextResponse.json(
        { error: "Failed to analyze budget", detail: "No JSON in response" },
        { status: 500 }
      );
    }

    const jsonText = rawText.slice(jsonStart);
    const fullResult: AnalysisOutput = JSON.parse(jsonText);

    // Save to database
    await supabase.from("analyses").insert({
      user_id: user.id,
      monthly_budget: input.monthlyBudget,
      current_spending: input.currentSpending,
      primary_goal: input.primaryGoal,
      age_range: input.ageRange,
      result: fullResult,
      is_premium: isPremium,
      claude_model: "claude-sonnet-4-5-20250929",
    });

    // Mark free analysis as used
    if (!isPremium) {
      await supabase
        .from("profiles")
        .update({ free_analysis_used: true })
        .eq("id", user.id);
    }

    // Return full or stripped result
    if (isPremium) {
      return NextResponse.json(fullResult);
    } else {
      return NextResponse.json(stripForFreeUser(fullResult));
    }
  } catch (error) {
    console.error("Budget analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to analyze budget", detail: message },
      { status: 500 }
    );
  }
}
