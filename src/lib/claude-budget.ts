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

CRITICAL — BUDGET UTILIZATION (THIS IS THE #1 PRIORITY):
- You MUST spend 90-100% of the user's monthlyBudget on PAID items ($mo > 0). This is non-negotiable.
- NEVER return an empty immediatePriorities array. EVERY budget MUST have paid items in immediatePriorities.
- Add up the $mo (costPerMonth) of ALL paid items across immediatePriorities + month2Additions + futureOptimizations. This sum MUST be 90-100% of the budget. If it's under 90%, you have FAILED — go back and add more paid items.
- MAXIMIZE ITEM COUNT: Recommend as many items as possible that fit within the budget. More items = more comprehensive protocol = better outcomes.
- SUPPLEMENTS ARE MANDATORY: Every budget, no matter how small, MUST include supplements (creatine, vitamin-d3-k2, magnesium-glycinate, omega-3 are all under $30/mo each). A $175 budget can fit 5-8 supplements plus equipment.
- Example for $175/mo: creatine ($10) + vitamin-d3-k2 ($15) + magnesium-glycinate ($15) + omega-3 ($25) + electrolytes ($20) + protein-optimization ($25) + gym-membership ($50) + blue-light-glasses ($8) = $168/mo (96% utilized). THIS is what $175 should look like — NOT just free items.
- For budgets $1000+/mo: Stack aggressively with premium items. Recommend 12-15+ paid items in immediatePriorities.
- For budgets $500-999/mo: Include premium-tier items. Recommend 10-12+ paid items in immediatePriorities.
- For budgets $300-499/mo: Include mid-tier items plus all foundational supplements. Recommend 8-10+ paid items.
- For budgets $100-299/mo: MUST include 5-8 paid items — foundational supplements PLUS 1-2 equipment/services. Do NOT leave budget unspent.
- For budgets <$100/mo: STILL include 3-5 paid items (cheap supplements). Even $50/mo can buy creatine + vitamin D + magnesium.
- FAILURE MODE TO AVOID: Do NOT put all items in freeOptimizations and leave paid arrays empty. That is the WRONG answer. The user is PAYING for recommendations on how to SPEND their budget.

IMPORTANT — NO PRICES IN TEXT:
- NEVER mention dollar amounts, costs, or prices in reasoning, implementationTip, synergiesExplained, personalizedInsight, or roiProjections fields.
- The app displays costs separately. If you mention "$30/month" in reasoning, it ruins the user experience.
- Focus reasoning on evidence, mechanisms, and expected outcomes — not price.

RULES:
- ALWAYS include EVERY $0 item in freeOptimizations — do not skip any. There are ~11 free items, include all of them.
- Never recommend items the user already spends on (provided in currentSpending)
- totalMonthlyCost must not exceed monthlyBudget but MUST be at least 90% of it
- Spread recommendations across categories (don't recommend only supplements)
- Factor in ageRange for age-specific recommendations (e.g., bone density for 50+, hormone optimization for 40+)
- Be specific in reasoning — cite the actual evidence, not vague claims
- ROI scores should be relative within this user's budget, not absolute
- immediatePriorities: 5-15 items to start THIS WEEK (scale with budget — $1000+ = 12-15, $500+ = 10-12, $200+ = 7-10, <$200 = 5-7)
- month2Additions: 3-8 items to add in WEEK 1 of month 2 (scale with budget — $1000+ = 6-8, $500+ = 4-6, $200+ = 3-4)
- futureOptimizations: 2-5 items to layer in by WEEK 2 of month 2 (NOT months out — everything must be introduced within 6 weeks to keep the user committed before habits regress)
- freeOptimizations: ALL $0 items not in currentSpending
- budgetBreakdown: percentage allocation by category (must sum to 100)
- roiProjections: realistic, specific expected outcomes at each timeframe
- Keep reasoning to 1-2 sentences max. Be concise. No prices.
- Keep implementationTip to 1 sentence. No prices.
- Keep roiProjections to 1-2 sentences each. No prices.
- urgentBuys: 2-4 PURCHASABLE items from immediatePriorities that the user should buy or subscribe to TODAY. Only items with $mo > 0 or that require a purchase. Include a short urgencyReason (1 sentence, no prices) explaining why acting now matters (e.g., "Consistency from day one compounds — starting this week gives you a 6-week head start on muscle protein synthesis."). These drive immediate action and revenue.
- CRITICAL: investmentId values MUST exactly match the "id" field from the INVESTMENTS list. Do not abbreviate, modify, or invent IDs. Copy them character-for-character.

OUTPUT: Return ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "immediatePriorities": [{ "investmentId": "string", "rank": 1, "roiScore": 85, "reasoning": "string", "implementationTip": "string", "synergiesExplained": "string" }],
  "month2Additions": [same shape],
  "futureOptimizations": [same shape],
  "freeOptimizations": [same shape],
  "urgentBuys": [{ "investmentId": "string", "urgencyReason": "string" }],
  "budgetBreakdown": { "supplement": 45, "equipment": 20, "blood_work": 15, "protocol": 10, "service": 10 },
  "roiProjections": { "day30": "string", "day90": "string", "day180": "string" },
  "personalizedInsight": "string",
  "totalMonthlyCost": 650
}`;

export function buildAnalysisPrompt(input: BudgetAnalysisInput) {
  const available = buildLeanInvestments(input);

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
    userPrompt: `INVESTMENTS (${available.length} items, fields: id,name,cat=category,$mo=costPerMonth,ev=evidenceStrength,ce=costEffectiveness,ease=implementationEase,ttb=timeToBenefit,syn=synergies,goal=goalAlignment):
${JSON.stringify(available)}

USER PROFILE:
- Budget: $${input.monthlyBudget}/mo
- Primary Goal: ${input.primaryGoal.replace(/_/g, " ")}
- Biological Sex: ${input.sex || "unspecified"}
- Age Range: ${input.ageRange || "unspecified"}
- Activity Level: ${input.activityLevel || "unspecified"}
- Weight: ${weightStr}
- Height: ${heightStr}
- Sleep Quality: ${input.sleepQuality || "unspecified"}
- Diet Type: ${(input.dietType || "unspecified").replace(/_/g, " ")}
- Health Concerns: ${healthConcerns}
- Currently spending on: [${input.currentSpending.join(",")}]

PERSONALIZATION RULES:
1. Tailor ALL recommendations to the full profile above. A 25-year-old male focused on performance needs a different protocol than a 55-year-old female focused on disease prevention.
2. SEX-SPECIFIC: If male, consider testosterone support, prostate health, male-pattern cardiovascular risk. If female, consider iron needs, bone density, hormonal cycle support. Adjust dosing where sex matters (iron, zinc, calcium).
3. SLEEP PRIORITY: If sleep is "poor", prioritize sleep interventions FIRST (magnesium glycinate, glycine, apigenin, sleep hygiene) — poor sleep undermines every other investment. If "fair", include 1-2 sleep supports. If "good", no special sleep focus.
4. DIET-AWARE: Plant-based → B12, creatine, DHA/EPA algae oil, iron, zinc. Keto/low-carb → electrolytes, fiber, micronutrient gaps. Mediterranean → fewer gaps, focus on goal-specific. Standard → omega-3, magnesium, vitamin D.
5. HEALTH CONCERNS: Map reported concerns to highest-impact interventions (e.g. cardiovascular → omega-3, CoQ10; cognitive → lion's mane, creatine; joint → collagen, curcumin; stress → ashwagandha, L-theanine; digestive → probiotics; energy → CoQ10, B-vitamins; immune → vitamin D, zinc, vitamin C).
6. Write personalizedInsight addressing the user's full profile — explain WHY these specific recommendations were chosen for their unique combination of factors.

CRITICAL CHECKLIST — VERIFY ALL BEFORE RESPONDING:
1. Count paid items ($mo > 0) in immediatePriorities. For a $${input.monthlyBudget} budget, this MUST be at least ${input.monthlyBudget >= 500 ? 10 : input.monthlyBudget >= 300 ? 8 : input.monthlyBudget >= 100 ? 5 : 3} items. If you have fewer, ADD MORE.
2. Add up the $mo of ALL paid items across immediatePriorities + month2Additions + futureOptimizations. This sum MUST be $${Math.round(input.monthlyBudget * 0.9)}-$${input.monthlyBudget}. If under $${Math.round(input.monthlyBudget * 0.9)}, ADD MORE PAID ITEMS.
3. Verify immediatePriorities contains SUPPLEMENTS (creatine, vitamin-d3-k2, magnesium-glycinate, omega-3 are ~$10-25/mo each). If zero supplements in immediatePriorities, you are WRONG — add them.
4. Count items in freeOptimizations. You MUST include ALL $0 items (there should be ~9-11).
5. Verify totalMonthlyCost equals your sum from step 2.
6. If immediatePriorities is empty, you have COMPLETELY FAILED. Start over.

Generate the optimized budget allocation as JSON.`,
  };
}

function buildLeanInvestments(input: BudgetAnalysisInput) {
  // Send ALL investments to Claude (only 60 total) — let the AI decide what's appropriate
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
      $mo: inv.costPerMonth,
      ev: inv.evidenceStrength,
      ce: inv.costEffectiveness,
      ease: inv.implementationEase,
      ttb: inv.timeToBenefit,
      syn: inv.synergies,
      goal: inv.goalAlignment,
    }));
}

// Build exact-match lookup map — no aliases to avoid collisions
const investmentMap = new Map<string, Investment>();
for (const inv of investments) {
  investmentMap.set(inv.id, inv);
}

export function resolveInvestment(id: string): Investment | undefined {
  // 1. Exact match (fastest)
  const exact = investmentMap.get(id);
  if (exact) return exact;
  // 2. Case-insensitive
  const lower = investmentMap.get(id.toLowerCase());
  if (lower) return lower;
  // 3. Prefix/contains match (fallback for when Claude tweaks an ID)
  return investments.find((inv) => inv.id.startsWith(id) || id.startsWith(inv.id));
}

// Get investment details by ID (uses fuzzy matching)
export function getInvestmentById(id: string): Investment | undefined {
  return resolveInvestment(id);
}
