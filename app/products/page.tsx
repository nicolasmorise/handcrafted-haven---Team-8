import Image from "next/image";
import { pool } from "@/lib/db";
import Link from "next/link";
import SearchProducts from "@/components/SearchProducts";
import CategoryFilter from "@/components/CategoryFilter";
import PriceSort from "@/components/PriceSort";
import Pagination from "@/components/Pagination";

type ProductRow = {
  id: string; // id is character(8) ex 30002020 = Carved Untensils
  title: string;
  price_cents: number;
  image_url: string; // ex "/products/art/flowerart.webp"
  category_code: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;

  const query = resolvedParams?.query ?? "";
  const category = resolvedParams?. category ?? "";
  const sort = resolvedParams?. sort ?? "";
  const page = Number(resolvedParams?.page) || 1;

  const PAGE_SIZE = 8;
  const offset = (page - 1) * PAGE_SIZE;

  let orderBy = "p.created_at DESC";

  if (sort === "price_asc") {
    orderBy = "p.price_cents ASC";
  } else if (sort === "price_desc") {
    orderBy = "p.price_cents DESC";
  }

  const result = await pool.query<ProductRow>(
    `
    SELECT
      p.id,
      p.title,
      p.price_cents,
      p.image_url,
      c.category_code
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE 
      ($1 = '' OR p.title ILIKE '%' || $1 || '%')
      AND ($2 = '' OR c.category_code = $2)
    ORDER BY ${orderBy}
    LIMIT $3 OFFSET $4;
  `,
  [query, category, PAGE_SIZE, offset]
  );

  const products = result.rows;

  const countResult = await pool.query<{ count: string }>(
    `
    SELECT COUNT(*) 
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE
      ($1 = '' OR p.title ILIKE '%' || $1 || '%')
      AND ($2 = '' OR c.category_code = $2);
    `,
    [query, category]
  );

  const totalProducts = Number(countResult.rows[0].count);
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <section>
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchProducts placeholder="Search products..." />
          <PriceSort />
        </div>

        <div className="flex gap-8">
          <CategoryFilter/>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h2 className="text-xl font-semibold mb-2">
                No products found
              </h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters.
              </p>
              <Link
                href="/products"
                className="inline-block rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Clear filters
              </Link>
            </div>
          )}

          {products.map((p) => {
            const price = (p.price_cents / 100).toFixed(2);

            return (
              <Link key={p.id} href={`/products/${p.id}`}>
                  <article
                  key={p.id}
                  className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-square w-full bg-gray-100">
                    {/* image_url example "/products/art/flowerart.webp" */}
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      priority={false}
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="font-semibold leading-snug">{p.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Category: {p.category_code}
                    </p>
                    <p className="mt-2 text-lg font-bold">${price}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  );
}
