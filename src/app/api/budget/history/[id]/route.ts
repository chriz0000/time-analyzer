import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";
import { type AnalysisOutput } from "@/lib/claude-budget";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAccessToken(request.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createSupabaseClient(token);
    const { data: analysis, error } = await supabase
      .from("analyses")
      .select("id, result, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json(analysis.result as AnalysisOutput);
  } catch {
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
  }
}
