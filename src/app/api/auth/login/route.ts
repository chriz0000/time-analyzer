import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message?.toLowerCase().includes("email not confirmed")
        ? "Please confirm your email before logging in. Check your inbox."
        : "Invalid email or password";
      return NextResponse.json(
        { error: msg },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name || "",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to log in" },
      { status: 500 }
    );
  }
}
