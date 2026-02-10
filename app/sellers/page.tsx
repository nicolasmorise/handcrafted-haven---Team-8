import Image from "next/image";
import { pool } from "@/lib/db";
import SellerBio from "./SellerBio"; // CLIENT COMPONENT for bio expansion button
import Link from "next/link";


export const dynamic = "force-dynamic";

type SellerRow = {
  id: string;            // character(8)
  public_id: string;     // e.g. seller-1
  display_name: string;  // Seller 1
  bio: string | null;
  avatar_url: string;    // /sellers/seller-1.webp
};

export default async function SellersPage() {
  const result = await pool.query<SellerRow>(`
    SELECT
      id,
      public_id,
      display_name,
      bio,
      avatar_url
    FROM sellers
    ORDER BY created_at DESC
    LIMIT 28;
  `);

  const sellers = result.rows;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 font-body">
      <section>
        <h1 className="mb-10 text-center font-heading text-4xl text-charcoal">
          Our Artisans
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          { sellers.map((s) => (
            <Link
              key={s.id}
              href={`/sellers/${s.id}`}
              className="block"
            >
              <article className="overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition">

              <div className="relative aspect-square w-full bg-gray-100">
                <Image
                  src={s.avatar_url}
                  alt={s.display_name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 25vw,
                         (min-width: 1024px) 33vw,
                         (min-width: 640px) 50vw,
                         100vw"
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold leading-snug">
                  {s.display_name}
                </h2>

                {/* CLIENT COMPONENT */}
                <SellerBio bio={s.bio} />

              </div>
                </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

