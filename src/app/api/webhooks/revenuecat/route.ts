import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET || "";

type RevenueCatEventType =
  | "INITIAL_PURCHASE"
  | "RENEWAL"
  | "CANCELLATION"
  | "UNCANCELLATION"
  | "EXPIRATION"
  | "BILLING_ISSUE"
  | "PRODUCT_CHANGE";

interface RevenueCatEvent {
  type: RevenueCatEventType;
  app_user_id: string;
  original_app_user_id: string;
  expiration_at_ms: number | null;
  event_timestamp_ms: number;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret via Authorization header
    const authHeader = request.headers.get("authorization");
    if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const event: RevenueCatEvent = body.event;

    if (!event?.type || !event?.app_user_id) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const userId = event.original_app_user_id || event.app_user_id;
    const expiresAt = event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : null;

    console.log(`RevenueCat webhook: ${event.type} for user ${userId}`);

    switch (event.type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UNCANCELLATION":
        await supabase
          .from("profiles")
          .update({
            subscription_status: "premium",
            subscription_expires_at: expiresAt,
            revenuecat_customer_id: event.app_user_id,
          })
          .eq("id", userId);
        break;

      case "CANCELLATION":
        // User cancelled but may still have access until expiry
        await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            subscription_expires_at: expiresAt,
          })
          .eq("id", userId);
        break;

      case "EXPIRATION":
        await supabase
          .from("profiles")
          .update({
            subscription_status: "free",
            subscription_expires_at: null,
          })
          .eq("id", userId);
        break;

      case "BILLING_ISSUE":
        // Keep current status, RevenueCat will send EXPIRATION if not resolved
        console.log(`Billing issue for user ${userId}`);
        break;

      default:
        console.log(`Unhandled RevenueCat event: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RevenueCat webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
