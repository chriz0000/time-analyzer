import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";
import { type BudgetAnalysisInput } from "@/lib/claude-budget";
import { buildAnalysisPrompt, normalizeOutput } from "@/lib/claude-budget";

export const maxDuration = 60;

const rateLimit = new Map<string, number[]>();
const WINDOW_MS = 3600_000;
const MAX_PER_HOUR = 5;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_HOUR) return true;
  recent.push(now);
  rateLimit.set(userId, recent);
  return false;
}

export async function POST(request: NextRequest) {
  let token: string | null;
  let userId: string;
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

    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 5 analyses per hour." },
        { status: 429 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }

  const body = await request.json();
  const input: BudgetAnalysisInput = {
    monthlyBudget: Math.max(0, Math.min(Number(body.monthlyBudget) || 100, 10000)),
    currentSpending: Array.isArray(body.currentSpending)
      ? body.currentSpending.filter((id: unknown) => typeof id === "string" && id.length < 100)
      : [],
    primaryGoal: ["lifespan", "performance", "disease_prevention", "aesthetics"].includes(body.primaryGoal)
      ? body.primaryGoal
      : "lifespan",
    sex: ["male", "female", "unspecified"].includes(body.sex) ? body.sex : undefined,
    ageRange: typeof body.ageRange === "string" ? body.ageRange.slice(0, 10) : undefined,
    activityLevel: ["low", "moderate", "high"].includes(body.activityLevel) ? body.activityLevel : undefined,
    weight: typeof body.weight === "string" ? body.weight.slice(0, 5).replace(/[^0-9]/g, "") || undefined : undefined,
    height: typeof body.height === "string" ? body.height.slice(0, 5).replace(/[^0-9]/g, "") || undefined : undefined,
    useMetric: body.useMetric === true,
    sleepQuality: ["poor", "fair", "good"].includes(body.sleepQuality) ? body.sleepQuality : undefined,
    dietType: ["standard", "plant_based", "keto_low_carb", "mediterranean"].includes(body.dietType) ? body.dietType : undefined,
    healthConcerns: Array.isArray(body.healthConcerns)
      ? body.healthConcerns.filter((c: unknown) => typeof c === "string" && c.length < 50).slice(0, 15)
      : [],
  };

  const { systemPrompt, userPrompt } = buildAnalysisPrompt(input);

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

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
        const parts = buffer.split("\n");
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
              // Incomplete JSON chunk
            }
          }
        }
      }

      if (buffer.trim().startsWith("data: ")) {
        const data = buffer.trim().slice(6);
        try {
          const event = JSON.parse(data);
          if (event.type === "content_block_delta" && event.delta?.text) {
            fullText += event.delta.text;
          }
        } catch {}
      }

      // Parse Claude's response
      fullText = fullText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
      const rawResult = JSON.parse(fullText);

      // Normalize into the app's expected shape
      // Handle both old format (immediatePriorities) and new format (protocol)
      let result;
      if (rawResult.protocol) {
        result = normalizeOutput(rawResult, input.monthlyBudget);
      } else {
        // Fallback: Claude returned old format — merge phased arrays
        result = rawResult;
        const seen = new Set((result.immediatePriorities ?? []).map((i: { investmentId: string }) => i.investmentId));
        for (const item of [...(result.month2Additions ?? []), ...(result.futureOptimizations ?? [])]) {
          if (!seen.has(item.investmentId)) {
            seen.add(item.investmentId);
            result.immediatePriorities.push(item);
          }
        }
        result.immediatePriorities?.forEach((item: { rank: number }, i: number) => { item.rank = i + 1; });
        result.month2Additions = [];
        result.futureOptimizations = [];
        const minTarget = input.monthlyBudget * 0.9;
        if ((result.totalMonthlyCost ?? 0) < minTarget) {
          result.totalMonthlyCost = Math.round(minTarget);
        }
      }

      // Log for debugging
      const paidCount = (result.immediatePriorities ?? []).length;
      const freeCount = (result.freeOptimizations ?? []).length;
      console.log(`Analysis: $${input.monthlyBudget} budget → ${paidCount} paid, ${freeCount} free, total $${result.totalMonthlyCost}`);

      // Save to database
      const { error: insertErr } = await supabase.from("analyses").insert({
        user_id: userId,
        monthly_budget: input.monthlyBudget,
        current_spending: input.currentSpending,
        primary_goal: input.primaryGoal,
        age_range: input.ageRange,
        result,
        is_premium: false,
        claude_model: "claude-haiku-4-5-20251001",
      });
      if (insertErr) console.error("Failed to save analysis:", insertErr.message);

      await writer.write(encoder.encode("\n" + JSON.stringify(result)));
      await writer.close();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Analysis error:", msg);
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
