import { NextRequest, NextResponse } from "next/server";
import { subscribeToConvertKit } from "@/lib/convertkit";

const rateLimit = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  rateLimit.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
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
        { error: "Failed to subscribe" },
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
