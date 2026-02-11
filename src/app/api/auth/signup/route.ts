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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email verification for less friction
        user_metadata: { first_name: firstName || "" },
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create profile
    await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      email,
      first_name: firstName || "",
    });

    // Subscribe to ConvertKit (non-blocking)
    subscribeToConvertKit({
      email,
      firstName: firstName || "",
      tags: { source: "budget-optimizer" },
    }).catch(() => {});

    // Sign in to get session tokens
    const { data: session, error: signInError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (signInError) {
      // User created but sign-in failed — they can log in manually
      return NextResponse.json({
        success: true,
        message: "Account created. Please log in.",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: firstName || "",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
