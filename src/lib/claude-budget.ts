import Anthropic from "@anthropic-ai/sdk";
import { investments, type BudgetGoal, type Investment } from "@/data/investments";

export interface BudgetAnalysisInput {
  monthlyBudget: number;
  currentSpending: string[]; // investment IDs
  primaryGoal: BudgetGoal;
  ageRange?: string;
}

export interface RankedItem {
  investmentId: string;
  rank: number;
  roiScore: number; // 1-100
  reasoning: string;
  implementationTip: string;
  synergiesExplained?: string;
}

export interface AnalysisOutput {
  immediatePriorities: RankedItem[];
  month2Additions: RankedItem[];
  futureOptimizations: RankedItem[];
  freeOptimizations: RankedItem[];
  budgetBreakdown: Record<string, number>; // category -> percentage
  roiProjections: {
    day30: string;
    day90: string;
    day180: string;
  };
  personalizedInsight: string;
  totalMonthlyCost: number;
}

const SYSTEM_PROMPT = `You are the Budget Optimizer AI for New Age Longevity, a science-first longevity brand.

Your role: Given a user's monthly health/longevity budget and their goals, rank the best investments by scientific ROI.

RANKING CRITERIA (in order of weight):
1. Evidence quality (40%): Peer-reviewed meta-analyses > RCTs > observational > mechanistic > anecdotal
2. Cost-effectiveness (25%): Benefit per dollar spent — free items get maximum score here
3. Implementation ease (15%): How easy to start and maintain consistently
4. Synergy with other recommended items (10%): Items that amplify each other rank higher together
5. Time to noticeable benefit (10%): Faster results rank higher for motivation/adherence

RULES:
- Always include ALL applicable $0 items in freeOptimizations regardless of budget
- Never recommend items the user already spends on (provided in currentSpending)
- Respect the monthly budget constraint — totalMonthlyCost must not exceed monthlyBudget
- Spread recommendations across categories (don't recommend only supplements)
- Factor in ageRange for age-specific recommendations (e.g., bone density for 50+, hormone optimization for 40+)
- Be specific in reasoning — cite the actual evidence, not vague claims
- ROI scores should be relative within this user's budget, not absolute
- immediatePriorities: 3-5 items to start this week
- month2Additions: 3-5 items to add in month 2
- futureOptimizations: 2-3 items for 6-12 months out
- freeOptimizations: ALL $0 items not in currentSpending
- budgetBreakdown: percentage allocation by category (must sum to 100)
- roiProjections: realistic, specific expected outcomes at each timeframe

OUTPUT: Return ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "immediatePriorities": [{ "investmentId": "string", "rank": 1, "roiScore": 85, "reasoning": "string", "implementationTip": "string", "synergiesExplained": "string" }],
  "month2Additions": [same shape],
  "futureOptimizations": [same shape],
  "freeOptimizations": [same shape],
  "budgetBreakdown": { "supplement": 45, "equipment": 20, "blood_work": 15, "protocol": 10, "service": 10 },
  "roiProjections": { "day30": "string", "day90": "string", "day180": "string" },
  "personalizedInsight": "string",
  "totalMonthlyCost": 187
}`;

export function buildAnalysisPrompt(input: BudgetAnalysisInput) {
  const available = buildLeanInvestments(input);
  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `INVESTMENTS (${available.length} items, fields: id,name,cat=category,$mo=costPerMonth,ev=evidenceStrength,ce=costEffectiveness,ease=implementationEase,ttb=timeToBenefit,syn=synergies,goal=goalAlignment):
${JSON.stringify(available)}

USER: budget=$${input.monthlyBudget}/mo, goal=${input.primaryGoal}, spending=[${input.currentSpending.join(",")}], age=${input.ageRange || "unspecified"}

Generate the optimized budget allocation as JSON.`,
  };
}

function buildLeanInvestments(input: BudgetAnalysisInput) {
  // Pre-filter by budget tier to reduce prompt size
  const maxTier = input.monthlyBudget >= 500 ? "premium"
    : input.monthlyBudget >= 200 ? "mid"
    : input.monthlyBudget >= 50 ? "budget"
    : "free";

  const tierOrder = ["free", "budget", "mid", "premium"];
  const maxTierIndex = tierOrder.indexOf(maxTier);

  return investments
    .filter((inv) => !input.currentSpending.includes(inv.id))
    .filter((inv) => tierOrder.indexOf(inv.tier) <= maxTierIndex + 1) // include one tier above for aspirational
    .map((inv) => ({
      id: inv.id,
      name: inv.name,
      cat: inv.category,
      $mo: inv.costPerMonth,
      ev: inv.evidenceStrength,
      ce: inv.costEffectiveness,
      ease: inv.implementationEase,
      ttb: inv.timeToBenefit,
      syn: inv.synergies,
      goal: inv.goalAlignment,
    }));
}

export async function analyzeBudgetStream(
  input: BudgetAnalysisInput
): Promise<ReadableStream> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const available = buildLeanInvestments(input);

  const userPrompt = `INVESTMENTS (${available.length} items, fields: id,name,cat=category,$mo=costPerMonth,ev=evidenceStrength,ce=costEffectiveness,ease=implementationEase,ttb=timeToBenefit,syn=synergies,goal=goalAlignment):
${JSON.stringify(available)}

USER: budget=$${input.monthlyBudget}/mo, goal=${input.primaryGoal}, spending=[${input.currentSpending.join(",")}], age=${input.ageRange || "unspecified"}

Generate the optimized budget allocation as JSON.`;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Collect streamed text chunks and return as a ReadableStream
  const encoder = new TextEncoder();
  let fullText = "";

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            fullText += event.delta.text;
            // Send a keep-alive space to prevent timeout
            controller.enqueue(encoder.encode(" "));
          }
        }

        // Strip code fences and parse
        fullText = fullText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
        const result: AnalysisOutput = JSON.parse(fullText);

        // Send the actual JSON result
        controller.enqueue(encoder.encode(JSON.stringify(result)));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(JSON.stringify({ error: "Failed to analyze budget", detail: msg })));
        controller.close();
      }
    },
  });
}

// Non-streaming version for local dev / long-timeout environments
export async function analyzeBudget(
  input: BudgetAnalysisInput
): Promise<AnalysisOutput> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const available = buildLeanInvestments(input);

  const userPrompt = `INVESTMENTS (${available.length} items, fields: id,name,cat=category,$mo=costPerMonth,ev=evidenceStrength,ce=costEffectiveness,ease=implementationEase,ttb=timeToBenefit,syn=synergies,goal=goalAlignment):
${JSON.stringify(available)}

USER: budget=$${input.monthlyBudget}/mo, goal=${input.primaryGoal}, spending=[${input.currentSpending.join(",")}], age=${input.ageRange || "unspecified"}

Generate the optimized budget allocation as JSON.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  let text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if Claude wraps the JSON
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  const result: AnalysisOutput = JSON.parse(text);
  return result;
}

// Strip premium fields for free users
export function stripForFreeUser(result: AnalysisOutput): Record<string, unknown> {
  return {
    immediatePriorities: result.immediatePriorities.slice(0, 3).map((item) => ({
      ...item,
      synergiesExplained: undefined,
    })),
    freeOptimizations: result.freeOptimizations,
    budgetBreakdown: result.budgetBreakdown,
    roiProjections: {
      day30: result.roiProjections.day30,
      day90: "",
      day180: "",
    },
    personalizedInsight: result.personalizedInsight,
    totalMonthlyCost: result.totalMonthlyCost,
    isLocked: true,
    lockedItemCount:
      result.immediatePriorities.length -
      3 +
      result.month2Additions.length +
      result.futureOptimizations.length,
  };
}

// Get investment details by ID
export function getInvestmentById(id: string): Investment | undefined {
  return investments.find((inv) => inv.id === id);
}
