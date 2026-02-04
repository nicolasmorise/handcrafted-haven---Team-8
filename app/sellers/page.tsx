import Image from "next/image";
import Link from "next/link";
import { pool } from "@/lib/db";

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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sellers.map((s) => (
            <Link
              key={s.id}
              href={`/sellers/${s.public_id}`}
              className="
                group overflow-hidden rounded-md
                bg-sage
                border border-[#6f8f6b]
                transition
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#6f8f6b]">
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

              {/* Content */}
              <div className="bg-sage px-4 py-4">
                <h2 className="font-heading text-lg text-cream">
                  {s.display_name}
                </h2>

                <p className="mt-2 text-sm text-[#000000] line-clamp-3">
                  {s.bio ?? "Handcrafted stories coming soon."}
                </p>

                <span className="mt-4 inline-block text-xs uppercase tracking-wide text-cream opacity-80 group-hover:underline">
                  View profile →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

