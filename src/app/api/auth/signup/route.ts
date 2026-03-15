import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { subscribeToConvertKit } from "@/lib/convertkit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create user with admin API (no email sent yet)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: { first_name: firstName || "" },
      });

    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

    if (authError) {
      // If user already exists but unconfirmed, resend confirmation
      const errMsg = authError.message || "";
      if (errMsg.includes("already") || errMsg.includes("duplicate") || errMsg.includes("exists")) {
        await fetch(`${supabaseUrl}/auth/v1/resend`, {
          method: "POST",
          headers: {
            "apikey": supabaseAnonKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "signup", email }),
        });
        return NextResponse.json({
          success: true,
          needsConfirmation: true,
          message: "Check your email to confirm your account.",
        });
      }
      return NextResponse.json(
        { error: "Unable to create account. Please try again." },
        { status: 400 }
      );
    }

    // Create profile (use admin to bypass RLS)
    await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      email,
      first_name: firstName || "",
    });

    // Trigger confirmation email
    await fetch(`${supabaseUrl}/auth/v1/resend`, {
      method: "POST",
      headers: {
        "apikey": supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "signup", email }),
    });

    // Subscribe to ConvertKit (non-blocking)
    subscribeToConvertKit({
      email,
      firstName: firstName || "",
      tags: { source: "budget-optimizer" },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      needsConfirmation: true,
      message: "Check your email to confirm your account.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
