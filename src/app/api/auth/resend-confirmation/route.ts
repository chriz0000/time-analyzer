import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

    const res = await fetch(`${supabaseUrl}/auth/v1/resend`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "signup", email }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not resend confirmation email. Please try again later." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to resend confirmation" },
      { status: 500 }
    );
  }
}
