import Image from "next/image";
import { pool } from "@/lib/db";
import { notFound } from "next/navigation";

type Product = {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  image_url: string;
  category_code: string;
};

type PageProps = {
  params: {
    id: string;
  };
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
        c.category_code
        FROM products p
        JOIN categories c ON c.id = p.category_id
        WHERE p.id = $1
        LIMIT 1;
        `,
        [id]
    );

    if (result.rows.length === 0) {
        notFound();
    }

    const product = result.rows[0];
    const price = (product.price_cents / 100).toFixed(2);

    return (
        <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
            <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover"
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

            <p className="mt-6 text-gray-700">
                {product.description}
            </p>

            {/* Seller section (UI only for now) */}
            <div className="mt-8 border-t pt-6">
                <p className="text-sm text-gray-500 mb-2">Seller</p>

                <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div>
                    <p className="font-medium">Seller Name</p>
                    <p className="text-sm text-gray-500">
                    View seller profile
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </main>
    );
}