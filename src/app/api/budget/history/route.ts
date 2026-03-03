import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
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
    const { data: analyses, error } = await supabase
      .from("analyses")
      .select("id, created_at, monthly_budget, primary_goal, result")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }

    // Return summary for list view, full result for detail
    const summaries = (analyses || []).map((a) => ({
      id: a.id,
      createdAt: a.created_at,
      monthlyBudget: a.monthly_budget,
      primaryGoal: a.primary_goal,
      totalMonthlyCost: (a.result as Record<string, unknown>)?.totalMonthlyCost,
      protocolCount:
        ((a.result as Record<string, unknown[]>)?.immediatePriorities?.length || 0) +
        ((a.result as Record<string, unknown[]>)?.month2Additions?.length || 0) +
        ((a.result as Record<string, unknown[]>)?.futureOptimizations?.length || 0),
    }));

    return NextResponse.json({ analyses: summaries });
  } catch {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
