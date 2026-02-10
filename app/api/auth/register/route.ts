import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const roleRaw = String(formData.get("role") ?? "buyer").toLowerCase();

    const role = roleRaw === "seller" ? "seller" : "buyer";

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

    // Use a transaction so user and seller stay in sync
    await pool.query("BEGIN");

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, passwordHash, role]
    );

    const userId = userResult.rows[0].id as string;

    // If registering as a seller, create a seller row and link it
    if (role === "seller") {
      // Generate a new numeric 8-char seller id based on the max existing id.
      // This assumes sellers.id is numeric text like '00000014'.
      const sellerIdResult = await pool.query<{
        next_id: string;
      }>(
        `SELECT LPAD((COALESCE(MAX(id)::int, 0) + 1)::text, 8, '0') AS next_id
         FROM sellers`
      );

      const sellerId = sellerIdResult.rows[0].next_id;
      const publicId = `seller-${sellerId}`;

      // Use provided avatar_url or default placeholder
      const finalAvatarUrl = avatarUrl || "/sellers/seller-1.webp";

      const sellerResult = await pool.query(
        `INSERT INTO sellers (id, public_id, display_name, bio, avatar_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
          sellerId,
          publicId,
          name,
          null,
          finalAvatarUrl,
        ]
      );

      const createdSellerId = sellerResult.rows[0].id as string;

      await pool.query(
        `UPDATE users
         SET seller_id = $1
         WHERE id = $2`,
        [createdSellerId, userId]
      );
    }

    await pool.query("COMMIT");

    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("Register error:", error);
    await pool.query("ROLLBACK");
    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}

