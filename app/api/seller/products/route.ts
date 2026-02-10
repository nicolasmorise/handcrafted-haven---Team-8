import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "seller" || !user.seller_id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const title = String(formData.get("title") ?? "").trim();
  const priceStr = String(formData.get("price") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();

  if (!title || !priceStr || !imageUrl || !categoryId) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const priceNumber = Number(priceStr);
  if (!Number.isFinite(priceNumber) || priceNumber < 0) {
    return NextResponse.json(
      { error: "Price must be a positive number." },
      { status: 400 }
    );
  }

  const priceCents = Math.round(priceNumber * 100);

  try {
    // Generate a new 8-char product id similar to sellers.
    const idResult = await pool.query<{ next_id: string }>(
      `SELECT LPAD((COALESCE(MAX(id)::int, 0) + 1)::text, 8, '0') AS next_id
       FROM products`
    );

    const productId = idResult.rows[0].next_id;

    await pool.query(
      `INSERT INTO products (id, title, price_cents, image_url, category_id, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [productId, title, priceCents, imageUrl, categoryId, user.seller_id]
    );

    return NextResponse.redirect(
      new URL(`/sellers/${user.seller_public_id ?? ""}`, req.url)
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}

