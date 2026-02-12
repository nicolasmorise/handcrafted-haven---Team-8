import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function makeId8() {
  return Math.floor(Math.random() * 100000000).toString().padStart(8, "0");
}

export async function POST(req: Request) {
  // User must be logged in (server checks who you are via cookie)
  const user = await getCurrentUser();

    if (!user) {
    return NextResponse.json(
        { error: "You must be signed in to write a review." },
        { status: 401 }
    );
    }

    if (user.role === "seller") {
    return NextResponse.json(
        { error: "Sellers cannot write reviews." },
        { status: 403 }
    );
    }


  // Read + validate input
  const body = await req.json().catch(() => null);
  const productId = String(body?.productId ?? "").trim();
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim();

  if (!productId) {
    return NextResponse.json({ error: "Missing productId." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5." }, { status: 400 });
  }
  if (comment.length < 10 || comment.length > 2000) {
    return NextResponse.json(
      { error: "Comment must be 10–2000 characters." },
      { status: 400 }
    );
  }

  // Optional: if you only want buyers to review
  // if (user.role !== "buyer") {
  //   return NextResponse.json({ error: "Only buyers can write reviews." }, { status: 403 });
  // }

  // 3) UPSERT: create OR edit, still one row per (user_id, product_id)
  await pool.query(
    `
    INSERT INTO public.reviews (id, product_id, user_id, rating, comment, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET
      rating = EXCLUDED.rating,
      comment = EXCLUDED.comment,
      updated_at = NOW();
    `,
    [makeId8(), productId, user.id, rating, comment]
  );

  return NextResponse.json({ ok: true });
}
