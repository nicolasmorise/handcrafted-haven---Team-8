import { cookies } from "next/headers";
import { pool } from "./db";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  role: "buyer" | "seller";
  seller_id: string | null;
  seller_public_id: string | null;
};

// Helper to get the currently logged-in user in server components / API routes.
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("hh_user_id")?.value;

  if (!userId) return null;

  const result = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.role,
       u.seller_id,
       s.public_id AS seller_public_id
     FROM users u
     LEFT JOIN sellers s ON s.id = u.seller_id
     WHERE u.id = $1`,
    [userId]
  );

  const user = result.rows[0] as AuthUser | undefined;
  return user ?? null;
}


