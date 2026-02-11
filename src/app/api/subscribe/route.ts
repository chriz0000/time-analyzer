import { NextRequest, NextResponse } from "next/server";
import { subscribeToConvertKit } from "@/lib/convertkit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await subscribeToConvertKit({
      email: body.email,
      firstName: body.name || "",
      tags: {
        time_available: String(body.timeAvailable || ""),
        fitness_level: body.fitnessLevel || "",
        budget: String(body.budget || ""),
        goal: body.goal || "",
        source: "time-analyzer",
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
