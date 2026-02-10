import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function clearAuthCookies(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/", req.url));

  // Clear auth cookies
  response.cookies.set("hh_user_id", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("hh_user_role", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST(req: NextRequest) {
  return clearAuthCookies(req);
}

export async function GET(req: NextRequest) {
  return clearAuthCookies(req);
}

