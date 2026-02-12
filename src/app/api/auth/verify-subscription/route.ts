import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient } from "@/lib/supabase";
import { getCustomerInfo } from "@/lib/revenuecat";

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

    // Only sync with RevenueCat if it's configured
    const customerInfo = await getCustomerInfo(user.id);
    if (process.env.REVENUECAT_API_KEY && customerInfo) {
      await supabase
        .from("profiles")
        .update({
          subscription_status: customerInfo.isPremium ? "premium" : "free",
          subscription_expires_at: customerInfo.expiresAt,
        })
        .eq("id", user.id);
    }

    // Get full profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const isPremium = profile?.subscription_status === "premium";

    return NextResponse.json({
      isPremium,
      expiresAt: profile?.subscription_expires_at ?? null,
      freeAnalysisUsed: profile?.free_analysis_used ?? false,
      profile,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to verify subscription" },
      { status: 500 }
    );
  }
}
