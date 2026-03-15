import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getAuthUser, createSupabaseClient, getSupabaseAdmin } from "@/lib/supabase";

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
      .select("id, email, first_name, age_range, primary_goal, monthly_budget, subscription_status, subscription_expires_at, free_analysis_used, revenuecat_customer_id")
      .eq("id", user.id)
      .single();

    // Determine premium status from profile DB (set by webhook)
    let isPremium = false;
    if (profile?.subscription_status === "premium") {
      // Check if subscription hasn't expired
      if (profile.subscription_expires_at) {
        isPremium = new Date(profile.subscription_expires_at) > new Date();
      } else {
        isPremium = true;
      }
    }

    // If profile says free but RevenueCat might have info, check RevenueCat API
    if (!isPremium && profile?.revenuecat_customer_id) {
      try {
        const rcResponse = await fetch(
          `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(profile.revenuecat_customer_id)}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REVENUECAT_SECRET_KEY || ""}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (rcResponse.ok) {
          const rcData = await rcResponse.json();
          const entitlements = rcData.subscriber?.entitlements?.premium;
          if (entitlements && new Date(entitlements.expires_date) > new Date()) {
            isPremium = true;
            // Sync to DB
            const admin = getSupabaseAdmin();
            await admin
              .from("profiles")
              .update({
                subscription_status: "premium",
                subscription_expires_at: entitlements.expires_date,
              })
              .eq("id", user.id);
          }
        }
      } catch {
        // RevenueCat API failure — fall back to DB status
      }
    }

    // Count analyses this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count: analysesThisMonth } = await supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart);

    return NextResponse.json({
      isPremium,
      expiresAt: profile?.subscription_expires_at || null,
      freeAnalysisUsed: profile?.free_analysis_used || false,
      analysesThisMonth: analysesThisMonth || 0,
      profile: profile ? {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        age_range: profile.age_range,
        primary_goal: profile.primary_goal,
        monthly_budget: profile.monthly_budget,
        subscription_status: profile.subscription_status,
        free_analysis_used: profile.free_analysis_used,
      } : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to verify subscription" },
      { status: 500 }
    );
  }
}
