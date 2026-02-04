// app/sellers/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { pool } from "@/lib/db";

// Types for the rows we get back from the database.
// Match the column names from your `sellers` and `products` tables.
type SellerRow = {
  id: string;
  public_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string;
};

type ProductRow = {
  id: string;
  title: string;
  price_cents: number;
  image_url: string;
  category_code: string;
};

export default async function SellerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // —— Step 1: Get the seller by slug (public_id) ——
  // We use a parameterized query ($1) to avoid SQL injection.
  const sellerResult = await pool.query<SellerRow>(
    `SELECT id, public_id, display_name, bio, avatar_url
     FROM sellers
     WHERE public_id = $1`,
    [slug]
  );

  const seller = sellerResult.rows[0];
  if (!seller) notFound();

  // —— Step 2: Get this seller's products ——
  // Products are linked to sellers via seller_id. If your schema
  // doesn't have seller_id on products yet, add it and backfill it.
  const productsResult = await pool.query<ProductRow>(
    `SELECT p.id, p.title, p.price_cents, p.image_url, c.category_code
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.seller_id = $1
     ORDER BY p.created_at DESC`,
    [seller.id]
  );

  const sellerProducts = productsResult.rows;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10 flex items-center gap-6">
        <Image
          src={seller.avatar_url}
          alt={seller.display_name}
          width={120}
          height={120}
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{seller.display_name}</h1>
          <p className="mt-2 text-gray-600">{seller.bio ?? "No bio yet."}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Products</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {sellerProducts.map((product) => {
            const price = (product.price_cents / 100).toFixed(2);
            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <div className="relative aspect-square w-full bg-gray-100">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {product.category_code}
                  </p>
                  <p className="mt-2 text-lg font-bold">${price}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
