import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser } from "@/lib/supabase";
import { investments } from "@/data/investments";

export async function GET(request: NextRequest) {
  const token = getAccessToken(request.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json({
    investments,
    lastUpdated: "2026-02-11T00:00:00Z",
  });
}
