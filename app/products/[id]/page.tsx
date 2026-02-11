import Image from "next/image";
import { pool } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";


export const dynamic = "force-dynamic";


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
  user_name: string | null;
};



type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

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


    if (result.rows.length === 0) {
        notFound();
    }

    const product = result.rows[0];

    const reviewsRes = await pool.query<ReviewRow>(
        `
        SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            u.name AS user_name
        FROM public.reviews r
        JOIN public.users u ON u.id = r.user_id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC;
        `,
        [id]
        );

    const reviews = reviewsRes.rows;


    return (
    <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
            <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-contain p-3"
            sizes="(min-width: 768px) 50vw, 100vw"
            />
        </div>

        {/* Info */}
        <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="mt-2 text-sm text-gray-600">
            Category: {product.category_code}
            </p>

            <p className="mt-2 text-xl font-semibold">
            ${(product.price_cents / 100).toFixed(2)}
            </p>

            <p className="mt-6 text-gray-700">{product.description}</p>

            {/* Seller section */}
            <div className="mt-8 border-t pt-6">
            <p className="mb-2 text-sm text-gray-500">Seller</p>

            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                <Image
                    src={product.seller_avatar_url ?? "/sellers/placeholder.png"}
                    alt={product.seller_name}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
                </div>

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

            {/* Reviews section */}
            <div className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold">Reviews</h2>

            {reviews.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">No reviews yet.</p>
            ) : (
                <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                    <div key={r.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{r.user_name ?? "User"}</p>
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
                        {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>
        </div>
    </main>
    );
}