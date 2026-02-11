import { protocols, Protocol, Goal, FitnessLevel } from "@/data/protocols";

export interface QuizAnswers {
  timeAvailable: number; // minutes per day
  fitnessLevel: FitnessLevel;
  budget: number; // monthly dollars
  goal: Goal;
  name: string;
  email: string;
}

export interface ScoredProtocol extends Protocol {
  score: number;
  matchReasons: string[];
}

export interface AnalysisResult {
  protocols: ScoredProtocol[];
  totalTimeUsed: number;
  totalMonthlyCost: number;
  schedule: {
    morning: ScoredProtocol[];
    afternoon: ScoredProtocol[];
    evening: ScoredProtocol[];
  };
}

export function analyzeProtocols(answers: QuizAnswers): AnalysisResult {
  const scored = protocols
    .map((protocol) => scoreProtocol(protocol, answers))
    .filter((p): p is ScoredProtocol => p !== null)
    .sort((a, b) => b.score - a.score);

  // Greedily pick top protocols that fit within time budget
  const selected: ScoredProtocol[] = [];
  let timeUsed = 0;
  let costUsed = 0;

  for (const protocol of scored) {
    if (timeUsed + protocol.timeRequired <= answers.timeAvailable) {
      if (costUsed + protocol.costPerMonth <= answers.budget) {
        selected.push(protocol);
        timeUsed += protocol.timeRequired;
        costUsed += protocol.costPerMonth;
      }
    }
    if (selected.length >= 5) break;
  }

  // If we have fewer than 5 and there are zero-time protocols, add them
  if (selected.length < 5) {
    const zeroTime = scored.filter(
      (p) => p.timeRequired === 0 && !selected.find((s) => s.id === p.id)
    );
    for (const p of zeroTime) {
      if (selected.length >= 5) break;
      if (costUsed + p.costPerMonth <= answers.budget) {
        selected.push(p);
        costUsed += p.costPerMonth;
      }
    }
  }

  const schedule = {
    morning: selected.filter(
      (p) => p.timeOfDay === "morning" || (p.timeOfDay === "flexible" && p.timeRequired <= 5)
    ),
    afternoon: selected.filter((p) => p.timeOfDay === "afternoon"),
    evening: selected.filter(
      (p) =>
        p.timeOfDay === "evening" ||
        (p.timeOfDay === "flexible" && p.timeRequired > 5)
    ),
  };

  return {
    protocols: selected,
    totalTimeUsed: selected.reduce((sum, p) => sum + p.timeRequired, 0),
    totalMonthlyCost: selected.reduce((sum, p) => sum + p.costPerMonth, 0),
    schedule,
  };
}

function scoreProtocol(
  protocol: Protocol,
  answers: QuizAnswers
): ScoredProtocol | null {
  // Hard filter: difficulty must be achievable
  const difficultyRank: Record<FitnessLevel, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };
  if (difficultyRank[protocol.difficulty] > difficultyRank[answers.fitnessLevel] + 1) {
    return null;
  }

  const reasons: string[] = [];
  let score = 0;

  // Goal alignment (heaviest weight — 40%)
  const goalScore = protocol.goalAlignment[answers.goal];
  score += goalScore * 4;
  if (goalScore >= 8) {
    reasons.push(`Strong match for your ${formatGoal(answers.goal)} goal`);
  }

  // Evidence strength (30%)
  score += protocol.evidenceStrength * 3;
  if (protocol.evidenceStrength >= 9) {
    reasons.push("Backed by strong clinical evidence");
  }

  // Time efficiency: higher score for protocols that use less of the budget (15%)
  if (answers.timeAvailable > 0 && protocol.timeRequired > 0) {
    const timeEfficiency = 10 - (protocol.timeRequired / answers.timeAvailable) * 10;
    score += Math.max(0, timeEfficiency) * 1.5;
  } else if (protocol.timeRequired === 0) {
    score += 15; // zero-time protocols get a bonus
    reasons.push("No additional time needed");
  }

  // Budget fit (15%)
  if (protocol.costPerMonth === 0) {
    score += 15;
    reasons.push("Completely free");
  } else if (answers.budget > 0) {
    const budgetEfficiency =
      10 - (protocol.costPerMonth / answers.budget) * 10;
    score += Math.max(0, budgetEfficiency) * 1.5;
  }

  return { ...protocol, score, matchReasons: reasons };
}

function formatGoal(goal: Goal): string {
  const labels: Record<Goal, string> = {
    lifespan: "longevity",
    energy: "energy",
    sleep: "sleep",
    body_composition: "body composition",
    mental_clarity: "mental clarity",
  };
  return labels[goal];
}
