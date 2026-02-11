import { NextRequest, NextResponse } from "next/server";
import { analyzeProtocols, QuizAnswers } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const answers: QuizAnswers = {
      timeAvailable: Number(body.timeAvailable) || 30,
      fitnessLevel: body.fitnessLevel || "beginner",
      budget: Number(body.budget) || 0,
      goal: body.goal || "lifespan",
      name: body.name || "",
      email: body.email || "",
    };

    const result = analyzeProtocols(answers);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze protocols" },
      { status: 500 }
    );
  }
}
