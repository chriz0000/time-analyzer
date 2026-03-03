import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const token = getAccessToken(request.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const supabase = createSupabaseClient(token);

    // Get full profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Always return isPremium: true so older frontend builds don't break
    return NextResponse.json({
      isPremium: true,
      expiresAt: null,
      freeAnalysisUsed: false,
      profile,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to verify subscription" },
      { status: 500 }
    );
  }
}
