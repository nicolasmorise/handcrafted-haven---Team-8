import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash, role, seller_id FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0] as
      | {
          id: string;
          name: string | null;
          email: string;
          password_hash: string;
          role: "buyer" | "seller";
          seller_id: string | null;
        }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set a simple session cookie with the user id and role.
    // For a production app, you'd want a more robust solution (e.g. NextAuth).
    const response = NextResponse.redirect(new URL("/", req.url));

    response.cookies.set("hh_user_id", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("hh_user_role", user.role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again later." },
      { status: 500 }
    );
  }
}

