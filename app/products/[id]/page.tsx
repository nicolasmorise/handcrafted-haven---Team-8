/*
|--------------------------------------------------------------------------
| Imports
|--------------------------------------------------------------------------
| utilities + DB + auth + UI components used by this page.
*/
import Image from "next/image";
import { pool } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import ReviewForm from "./ReviewForm";

/*
|--------------------------------------------------------------------------
| Force dynamic rendering
|--------------------------------------------------------------------------
| Required because:
| - Uses cookies (auth)
| - Reads live DB data
| - Stops caching stale reviews / auth state
*/
export const dynamic = "force-dynamic";

/*
|--------------------------------------------------------------------------
| Type Definitions — DB Query Result Shapes
|--------------------------------------------------------------------------
*/
type Product = {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  image_url: string;
  category_code: string;

  seller_id: string;
  seller_name: string;
  seller_avatar_url: string | null;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string | null;
  user_name: string | null;
};

type MyReviewRow = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string | null;
};

/*
|--------------------------------------------------------------------------
| Page Props
|--------------------------------------------------------------------------
*/
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ review?: string }>;
};

/*
|--------------------------------------------------------------------------
| Product Page Server
|--------------------------------------------------------------------------
| Functions:
| 1. Load product
| 2. Load all reviews (public display)
| 3. Load logged-in user
| 4. Load THIS user's review for edit 
*/
export default async function ProductPage({ params, searchParams }: PageProps) {
  /* ------------------------------
     Determine product ID from route
  ------------------------------ */
  const { id } = await params;

  // If ?review=1 is present, show the review form
  const sp = (await searchParams) ?? {};
  const showReviewForm = sp.review === "1";

  /* ------------------------------
     Query #1 — Product + Seller + Category
  ------------------------------ */
  const result = await pool.query<Product>(
    `
    SELECT
      p.id,
      p.title,
      p.description,
      p.price_cents,
      p.image_url,
      c.category_code,

      s.id AS seller_id,
      s.display_name AS seller_name,
      s.avatar_url AS seller_avatar_url
    FROM products p
    JOIN categories c ON c.id = p.category_id
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.id = $1
    LIMIT 1;
    `,
    [id]
  );

  if (result.rows.length === 0) notFound();
  const product = result.rows[0];

  /* ------------------------------
     Query #2 — All Reviews (Public Display)
  ------------------------------ */
  const reviewsRes = await pool.query<ReviewRow>(
    `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      r.updated_at,
      u.name AS user_name
    FROM public.reviews r
    JOIN public.users u ON u.id = r.user_id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC;
    `,
    [id]
  );

  const reviews = reviewsRes.rows;

  /* ------------------------------
     Auth — Get Current Logged-In User
  ------------------------------ */
  const user = await getCurrentUser();

  /* ------------------------------
     Query #3 — This User's Review (when form is opened)
     Check to:
     - Prevent duplicate review
     - Pre-fill edit form
  ------------------------------ */
  let myReview: MyReviewRow | null = null;

  if (user && showReviewForm) {
    const myRes = await pool.query<MyReviewRow>(
      `
      SELECT id, rating, comment, created_at, updated_at
      FROM public.reviews
      WHERE product_id = $1 AND user_id = $2
      LIMIT 1;
      `,
      [id, user.id]
    );

    myReview = myRes.rows[0] ?? null;
  }

  /*
  |--------------------------------------------------------------------------
  | Render 2-column layout with Tailwind CSS
  |--------------------------------------------------------------------------
  | Layout:
  | Left  = Product Image
  | Right = Product Info + Seller + Reviews + Review action/form
  */
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">

        {/* =========================================================
           LEFT COLUMN — PRODUCT IMAGE
        ========================================================= */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-contain p-3"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        {/* =========================================================
           RIGHT COLUMN — PRODUCT INFO + SELLER + REVIEWS
        ========================================================= */}
        <div>
          {/* ---------------- Product Info ---------------- */}
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <p className="mt-2 text-sm text-gray-600">
            Category: {product.category_code}
          </p>

          <p className="mt-2 text-xl font-semibold">
            ${(product.price_cents / 100).toFixed(2)}
          </p>

          <p className="mt-6 text-gray-700">{product.description}</p>

          {/* ---------------- Seller Info Block ---------------- */}
          <div className="mt-8 border-t pt-6">
            <p className="mb-2 text-sm text-gray-500">Seller</p>

            <div className="flex items-center gap-4">

              {/* Seller Avatar / Profile Picture */}
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src={product.seller_avatar_url ?? "/sellers/placeholder.png"}
                  alt={product.seller_name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* Seller Name + Profile Link */}
              <div>
                <p className="font-medium">{product.seller_name}</p>

                <Link
                  href={`/sellers/${product.seller_id}`}
                  className="text-sm text-gray-500 hover:underline"
                >
                  View seller profile
                </Link>
              </div>
            </div>
          </div>

          {/* =========================
              Reviews section
          ========================== */}
          <div id="reviews" className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold">Reviews</h2>

            {/* ---------- login link OR write link OR form ---------- */}
            {!user ? (
              <p className="mt-2 text-sm text-gray-500">
                <Link className="underline" href="/login">
                  Sign in
                </Link>{" "}
                to write a review.
              </p>
            ) : user.role === "seller" ? (
              <p className="mt-2 text-sm text-gray-500">
                Sellers can’t write reviews.
              </p>
            ) : !showReviewForm ? (
              <p className="mt-2 text-sm">
                <Link className="underline" href={`?review=1#reviews`}>
                  Write a review
                </Link>
              </p>
            ) : (
              <div className="mt-3">
                <ReviewForm
                  productId={id}
                  existing={myReview ? { rating: myReview.rating, comment: myReview.comment } : null}
                />
                <p className="mt-2 text-xs text-gray-500">
                  <Link className="underline" href={`#reviews`}>Cancel</Link>
                  {" · "}
                  <Link className="underline" href={`?`}>Close form</Link>
                </p>
              </div>
            )}


            {/* ---------- Review list ---------- */}
            {reviews.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((r) => {
                  const edited =
                    r.updated_at &&
                    new Date(r.updated_at).getTime() >
                      new Date(r.created_at).getTime();

                  const displayDate = edited ? r.updated_at! : r.created_at;

                  return (
                    <div key={r.id} className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {r.user_name ?? "User"}
                        </p>

                        <p className="text-sm text-gray-600">
                          {"★".repeat(r.rating)}{" "}
                          <span className="text-gray-400">
                            {"★".repeat(5 - r.rating)}
                          </span>
                        </p>
                      </div>

                      <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                        {r.comment}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(displayDate).toLocaleDateString()}
                        {edited ? (
                          <span className="ml-2 italic text-gray-400">
                            edited
                          </span>
                        ) : null}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
