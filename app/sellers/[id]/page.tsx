import Image from "next/image";
import Link from "next/link";
import { pool } from "@/lib/db";



export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type SellerRow = {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string;
};

type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  image_url: string;
  category_name: string;
};

export default async function SellerProductsPage({ params }: Props) {
  const { id } = await params;

  // Load seller (for header card)
  const sellerRes = await pool.query<SellerRow>(
  `
  SELECT id, public_id, display_name, bio, avatar_url
  FROM sellers
  WHERE id = $1 OR public_id = $1
  LIMIT 1;
  `,
  [id]
);


const seller = sellerRes.rows[0];

  if (!seller) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-2xl font-bold">Seller not found</h1>
        <p className="mt-2">
          <Link className="underline" href="/sellers">
            Back to sellers
          </Link>
        </p>
      </main>
    );
  }

  // Load products for seller
  const productsRes = await pool.query<ProductRow>(
    `
    SELECT
      p.id,
      p.title,
      p.description,
      p.price_cents,
      p.image_url,
      c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.seller_id = $1
    ORDER BY p.created_at DESC;
    `,
    [seller.id]
  );

  const products = productsRes.rows;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      {/* Seller header row: card + bio card + back button */}
<div className="mb-10 flex items-start gap-6">
    {/* Left: Seller identity card */}
    <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
        <Image
          src={seller.avatar_url}
          alt={seller.display_name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold leading-tight">
          {seller.display_name}
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>

    {/* Middle: Bio card (fills space) */}
    <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-gray-500">About</p>

      <p className="mt-1 text-sm text-gray-700">
        {seller.bio?.trim() || "This seller hasn’t added a bio yet."}
      </p>
    </div>

    {/* Right: Back button */}
    <Link
      href="/sellers"
      className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
    >
      ← Back to sellers
    </Link>
  </div>


      {/* Products */}
      {products.length === 0 ? (
        <p className="text-gray-600">No products found for this seller.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const price = (p.price_cents / 100).toFixed(2);

            return (
              <Link key={p.id} href={`/products/${p.id}`} className="block">
                <article className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative aspect-square w-full bg-gray-100">
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="font-semibold leading-snug">{p.title}</h2>

                    <p className="mt-1 text-sm text-gray-600">
                      Category: {p.category_name}
                    </p>

                    {p.description ? (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                        {p.description}
                      </p>
                    ) : null}

                    <p className="mt-2 text-lg font-bold">${price}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
