import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "seller" || !user.seller_id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  if (!name) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }

  try {
    await pool.query("BEGIN");

    // Update the user name (shown in header) and seller display fields
    await pool.query(
      `UPDATE users
       SET name = $1
       WHERE id = $2`,
      [name, user.id]
    );

    await pool.query(
      `UPDATE sellers
       SET display_name = $1,
           bio = $2,
           avatar_url = COALESCE(NULLIF($3, ''), avatar_url)
       WHERE id = $4`,
      [name, bio || null, avatarUrl, user.seller_id]
    );

    await pool.query("COMMIT");

    return NextResponse.redirect(new URL("/seller/profile", req.url));
  } catch (error) {
    console.error("Update seller profile error:", error);
    await pool.query("ROLLBACK");
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}

