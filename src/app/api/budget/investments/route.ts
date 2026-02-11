import { NextResponse } from "next/server";
import { investments } from "@/data/investments";

export async function GET() {
  return NextResponse.json({
    investments,
    lastUpdated: "2026-02-11T00:00:00Z",
  });
}
