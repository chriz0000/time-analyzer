import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";
import { getInvestmentById } from "@/lib/claude-budget";
import { buildAffiliateUrl } from "@/lib/affiliate";

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

    const body = await request.json();
    const { investmentId, analysisId } = body;

    if (!investmentId) {
      return NextResponse.json({ error: "investmentId required" }, { status: 400 });
    }

    const investment = getInvestmentById(investmentId);
    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 });
    }

    // Log the click
    const supabase = createSupabaseClient(token);
    await supabase.from("affiliate_clicks").insert({
      user_id: user.id,
      investment_id: investmentId,
      analysis_id: analysisId || null,
    });

    const redirectUrl = buildAffiliateUrl(investment);

    return NextResponse.json({ redirectUrl });
  } catch {
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
