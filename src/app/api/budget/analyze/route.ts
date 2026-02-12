import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";
import { stripForFreeUser, type BudgetAnalysisInput, type AnalysisOutput } from "@/lib/claude-budget";
import { buildAnalysisPrompt } from "@/lib/claude-budget";

export const maxDuration = 60;

const rateLimit = new Map<string, number[]>();
const WINDOW_MS = 3600_000;
const MAX_PREMIUM = 3;

function isRateLimited(userId: string, isPremium: boolean): boolean {
  if (!isPremium) return false;
  const now = Date.now();
  const timestamps = rateLimit.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PREMIUM) return true;
  recent.push(now);
  rateLimit.set(userId, recent);
  return false;
}

export async function POST(request: NextRequest) {
  // Auth + profile checks (must complete within first few seconds)
  let token: string | null;
  let userId: string;
  let isPremium: boolean;
  let supabase: ReturnType<typeof createSupabaseClient>;

  try {
    token = getAccessToken(request.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    userId = user.id;

    supabase = createSupabaseClient(token);
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, free_analysis_used")
      .eq("id", user.id)
      .single();

    isPremium = profile?.subscription_status === "premium";

    if (!isPremium && profile?.free_analysis_used) {
      return NextResponse.json(
        { error: "Free analysis already used. Upgrade to premium for unlimited analyses.", isLocked: true },
        { status: 403 }
      );
    }

    if (isRateLimited(user.id, isPremium)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 3 analyses per hour." },
        { status: 429 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }

  // Build the prompt
  const body = await request.json();
  const input: BudgetAnalysisInput = {
    monthlyBudget: Math.max(0, Math.min(Number(body.monthlyBudget) || 100, 10000)),
    currentSpending: Array.isArray(body.currentSpending)
      ? body.currentSpending.filter((id: unknown) => typeof id === "string" && id.length < 100)
      : [],
    primaryGoal: ["lifespan", "performance", "disease_prevention", "aesthetics"].includes(body.primaryGoal)
      ? body.primaryGoal
      : "lifespan",
    ageRange: typeof body.ageRange === "string" ? body.ageRange.slice(0, 10) : undefined,
  };

  const { systemPrompt, userPrompt } = buildAnalysisPrompt(input);

  // Stream the response to keep the connection alive
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Start the Claude call in the background while we return the stream
  (async () => {
    let fullText = "";
    try {
      if (!process.env.ANTHROPIC_API_KEY) {
        await writer.write(encoder.encode(JSON.stringify({ error: "Server configuration error" })));
        await writer.close();
        return;
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 8192,
          stream: true,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        console.error("Claude API error:", response.status);
        await writer.write(encoder.encode(JSON.stringify({ error: "Analysis service unavailable" })));
        await writer.close();
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (separated by double newlines)
        const parts = buffer.split("\n");
        // Keep the last part as it may be incomplete
        buffer = parts.pop() || "";

        for (const line of parts) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;
            try {
              const event = JSON.parse(data);
              if (event.type === "content_block_delta" && event.delta?.text) {
                fullText += event.delta.text;
                await writer.write(encoder.encode(" "));
              }
            } catch {
              // Incomplete JSON, will be handled in next chunk
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim().startsWith("data: ")) {
        const data = buffer.trim().slice(6);
        try {
          const event = JSON.parse(data);
          if (event.type === "content_block_delta" && event.delta?.text) {
            fullText += event.delta.text;
          }
        } catch {}
      }

      // Parse the collected response
      fullText = fullText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
      const fullResult: AnalysisOutput = JSON.parse(fullText);

      // Save to database (fire and forget)
      supabase.from("analyses").insert({
        user_id: userId,
        monthly_budget: input.monthlyBudget,
        current_spending: input.currentSpending,
        primary_goal: input.primaryGoal,
        age_range: input.ageRange,
        result: fullResult,
        is_premium: isPremium,
        claude_model: "claude-haiku-4-5-20251001",
      }).then(({ error }) => {
        if (error) console.error("Failed to save analysis:", error.message);
      });

      if (!isPremium) {
        supabase.from("profiles")
          .update({ free_analysis_used: true })
          .eq("id", userId)
          .then(({ error }) => {
            if (error) console.error("Failed to update free_analysis_used:", error.message);
          });
      }

      // Send the final JSON result
      const result = isPremium ? fullResult : stripForFreeUser(fullResult);
      await writer.write(encoder.encode("\n" + JSON.stringify(result)));
      await writer.close();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      try {
        await writer.write(encoder.encode(JSON.stringify({ error: "Failed to analyze budget", detail: msg })));
        await writer.close();
      } catch {
        // Writer may already be closed
      }
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
