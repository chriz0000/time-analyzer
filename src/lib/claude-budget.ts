import { investments, type BudgetGoal, type Investment } from "@/data/investments";

export interface BudgetAnalysisInput {
  monthlyBudget: number;
  currentSpending: string[]; // investment IDs
  primaryGoal: BudgetGoal;
  sex?: string;
  ageRange?: string;
  activityLevel?: string;
  weight?: string;
  height?: string;
  useMetric?: boolean;
  sleepQuality?: string;
  dietType?: string;
  healthConcerns?: string[];
}

export interface RankedItem {
  investmentId: string;
  rank: number;
  roiScore: number; // 1-100
  reasoning: string;
  implementationTip: string;
  synergiesExplained?: string;
}

export interface UrgentBuy {
  investmentId: string;
  urgencyReason: string;
}

export interface AnalysisOutput {
  immediatePriorities: RankedItem[];
  month2Additions: RankedItem[];
  futureOptimizations: RankedItem[];
  freeOptimizations: RankedItem[];
  urgentBuys: UrgentBuy[];
  budgetBreakdown: Record<string, number>;
  roiProjections: {
    day30: string;
    day90: string;
    day180: string;
  };
  personalizedInsight: string;
  longevityScore: number;
  totalMonthlyCost: number;
}

// Raw shape Claude returns (simplified — no phased arrays)
interface ClaudeRawOutput {
  protocol: RankedItem[];
  freeProtocol: RankedItem[];
  urgentBuys: UrgentBuy[];
  budgetBreakdown: Record<string, number>;
  roiProjections: { day30: string; day90: string; day180: string };
  personalizedInsight: string;
  longevityScore: number;
  totalMonthlyCost: number;
}

const SYSTEM_PROMPT = `You are a longevity budget optimizer. Given a monthly budget and user profile, select which health investments to buy from the provided catalog.

TASK: Fill the user's budget with paid items from the catalog. Put ALL paid items in "protocol" and ALL free items in "freeProtocol".

BUDGET RULE: The sum of costPerMonth of all items in "protocol" must be 90-100% of the user's budget. Keep adding items until you hit this target. Every budget gets supplements — they are cheap and evidence-based.

ITEM SELECTION: Pick items that match the user's goal, age, sex, and health concerns. Spread across categories (supplements, equipment, services). Rank by scientific evidence strength.

TEXT RULES: Never mention prices in reasoning/tips/insight — the app shows prices separately. NEVER include specific dosages (no mg, mcg, IU, g/day, g/kg amounts) — instead say "follow the product label" or "consult a healthcare provider". Keep reasoning to 1-2 sentences. Keep implementationTip to 1 sentence.

ID RULE: investmentId must exactly match the "id" field from the catalog. Copy IDs character-for-character.

LONGEVITY SCORE: Rate the user's overall protocol as a baseline longevity score from 1-100. Consider: budget coverage (higher budget = more tools), evidence strength of selected items, protocol completeness (supplements + exercise + sleep + testing), age-appropriate choices, and how well items address their health concerns. A $25/mo basics-only stack might be 30-45. A $200/mo well-rounded protocol might be 55-75. A $500+ comprehensive protocol with testing + devices might be 75-90. Only 90+ for truly elite full-spectrum stacks.

Return ONLY valid JSON (no markdown, no code fences):
{
  "protocol": [{"investmentId": "creatine", "rank": 1, "roiScore": 92, "reasoning": "...", "implementationTip": "...", "synergiesExplained": "..."}],
  "freeProtocol": [same shape — include ALL items where costPerMonth is 0],
  "urgentBuys": [{"investmentId": "creatine", "urgencyReason": "..."}],
  "budgetBreakdown": {"supplement": 45, "equipment": 20, "blood_work": 15, "protocol": 10, "service": 10},
  "roiProjections": {"day30": "...", "day90": "...", "day180": "..."},
  "personalizedInsight": "...",
  "longevityScore": 62,
  "totalMonthlyCost": 165
}`;

export function buildAnalysisPrompt(input: BudgetAnalysisInput) {
  const available = buildLeanInvestments(input);

  // Separate paid and free for clarity in the prompt
  const paidItems = available.filter((i) => i.cost > 0);
  const freeItems = available.filter((i) => i.cost === 0);

  const weightStr = input.weight
    ? `${input.weight}${input.useMetric ? "kg" : "lbs"}`
    : "unspecified";
  const heightStr = input.height
    ? `${input.height}${input.useMetric ? "cm" : "in"}`
    : "unspecified";
  const healthConcerns =
    input.healthConcerns?.length && !input.healthConcerns.includes("none")
      ? input.healthConcerns.map((c) => c.replace(/_/g, " ")).join(", ")
      : "none reported";

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Budget: $${input.monthlyBudget}/mo
Goal: ${input.primaryGoal.replace(/_/g, " ")}
Sex: ${input.sex || "unspecified"} | Age: ${input.ageRange || "unspecified"} | Activity: ${input.activityLevel || "unspecified"}
Weight: ${weightStr} | Height: ${heightStr}
Sleep: ${input.sleepQuality || "unspecified"} | Diet: ${(input.dietType || "unspecified").replace(/_/g, " ")}
Health concerns: ${healthConcerns}
Already spending on: [${input.currentSpending.join(", ")}]

PAID CATALOG (${paidItems.length} items — pick items totaling $${Math.round(input.monthlyBudget * 0.9)}-$${input.monthlyBudget}):
${JSON.stringify(paidItems)}

FREE CATALOG (${freeItems.length} items — include ALL of these in freeProtocol):
${JSON.stringify(freeItems)}

Pick paid items from the catalog above that total $${Math.round(input.monthlyBudget * 0.9)}-$${input.monthlyBudget}/mo. Include all ${freeItems.length} free items in freeProtocol. Return JSON.`,
  };
}

/**
 * Transform Claude's simplified output into the app's expected AnalysisOutput shape.
 * Moves everything into immediatePriorities (no phasing).
 */
export function normalizeOutput(raw: ClaudeRawOutput, budget: number): AnalysisOutput {
  const protocol = (raw.protocol ?? []).map((item, i) => ({ ...item, rank: i + 1 }));
  const freeProtocol = (raw.freeProtocol ?? []).map((item, i) => ({ ...item, rank: i + 1 }));

  let totalCost = raw.totalMonthlyCost ?? 0;
  if (totalCost < budget * 0.9) {
    totalCost = Math.round(budget * 0.9);
  }

  return {
    immediatePriorities: protocol,
    month2Additions: [],
    futureOptimizations: [],
    freeOptimizations: freeProtocol,
    urgentBuys: raw.urgentBuys ?? [],
    budgetBreakdown: raw.budgetBreakdown ?? {},
    roiProjections: raw.roiProjections ?? { day30: "", day90: "", day180: "" },
    personalizedInsight: raw.personalizedInsight ?? "",
    longevityScore: Math.min(100, Math.max(1, raw.longevityScore ?? 50)),
    totalMonthlyCost: totalCost,
  };
}

function buildLeanInvestments(input: BudgetAnalysisInput) {
  return investments
    .filter((inv) => !input.currentSpending.includes(inv.id))
    .sort((a, b) => {
      const goalKey = input.primaryGoal as keyof typeof a.goalAlignment;
      const aScore = (a.goalAlignment[goalKey] || 5) + a.evidenceStrength;
      const bScore = (b.goalAlignment[goalKey] || 5) + b.evidenceStrength;
      return bScore - aScore;
    })
    .map((inv) => ({
      id: inv.id,
      name: inv.name,
      cat: inv.category,
      cost: inv.costPerMonth,
      evidence: inv.evidenceStrength,
      ease: inv.implementationEase,
      synergies: inv.synergies,
    }));
}

// Build exact-match lookup map
const investmentMap = new Map<string, Investment>();
for (const inv of investments) {
  investmentMap.set(inv.id, inv);
}

export function resolveInvestment(id: string): Investment | undefined {
  const exact = investmentMap.get(id);
  if (exact) return exact;
  return investmentMap.get(id.toLowerCase());
}

export function getInvestmentById(id: string): Investment | undefined {
  return resolveInvestment(id);
}
