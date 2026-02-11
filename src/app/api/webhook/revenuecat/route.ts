import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyWebhookSignature } from "@/lib/revenuecat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("authorization");

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event?.event?.type;
    const appUserId = event?.event?.app_user_id;

    if (!appUserId) {
      return NextResponse.json({ error: "Missing app_user_id" }, { status: 400 });
    }

    switch (eventType) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UNCANCELLATION":
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "premium",
            subscription_expires_at: event?.event?.expiration_at_ms
              ? new Date(event.event.expiration_at_ms).toISOString()
              : null,
          })
          .eq("id", appUserId);
        break;

      case "CANCELLATION":
      case "EXPIRATION":
      case "BILLING_ISSUE":
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "cancelled",
          })
          .eq("id", appUserId);
        break;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
