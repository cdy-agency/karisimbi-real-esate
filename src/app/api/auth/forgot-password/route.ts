// src/app/api/auth/forgot-password/route.ts

import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  resetPasswordEmailHtml,
  resetPasswordEmailText,
} from "@/src/lib/email-templates";

export const runtime = "nodejs";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

/* ── Supabase client (server-side only) ── */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/* ── Nodemailer transporter ── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ── POST /api/auth/forgot-password ── */
export async function POST(request: Request) {
  try {
    /* 1. Parse + validate body */
    const body = (await request
      .json()
      .catch(() => null)) as { email?: unknown } | null;

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    /* 2. Look up the user */
    const { data: user, error: findError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      console.error("[forgot-password] DB lookup error:", findError);
      return NextResponse.json(
        { success: false, error: "Database error. Please try again." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "This email is not registered" },
        { status: 404 }
      );
    }

    /* 3. Generate a secure token */
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

    /* 4. Save token to database */
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        reset_token: token,
        reset_token_expiry: expiry,
      })
      .eq("email", email);

    if (updateError) {
      console.error("[forgot-password] Token save error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to generate reset token" },
        { status: 500 }
      );
    }

    /* 5. Build the reset link */
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(
      token
    )}`;

    /* 6. Send the styled email */
    await transporter.sendMail({
      from: `"Karisimbi Real Estate" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your Password — Karisimbi Real Estate",
      html: resetPasswordEmailHtml(resetLink, email),
      text: resetPasswordEmailText(resetLink),
    });

    return NextResponse.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[forgot-password] Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}