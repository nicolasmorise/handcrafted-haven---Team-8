import Image from "next/image";
import { pool } from "@/lib/db";

type ProductRow = {
  id: string; // id is character(8) ex 30002020 = Carved Untensils
  title: string;
  price_cents: number;
  image_url: string; // ex "/products/art/flowerart.webp"
  category_code: string;
};

export default async function ProductsPage() {
  const result = await pool.query<ProductRow>(`
    SELECT
      p.id,
      p.title,
      p.price_cents,
      p.image_url,
      c.category_code
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ORDER BY p.created_at DESC
    LIMIT 28;
  `);

  const products: ProductRow[] = result.rows;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <section>
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const price = (p.price_cents / 100).toFixed(2);

            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <div className="relative aspect-square w-full bg-gray-100">
                  {/* image_url example "/products/art/flowerart.webp" */}
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    className="object-cover"
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
            );
          })}
        </div>
      </section>
    </main>
  );
}
