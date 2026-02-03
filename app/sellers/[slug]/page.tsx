// app/sellers/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { sellers, products } from "../../lib/data";

export default async function SellerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const seller = sellers.find((s) => s.slug === slug);
  if (!seller) notFound();

  const sellerProducts = products.filter(
    (p) => p.sellerSlug === slug
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10 flex items-center gap-6">
        <Image
          src={seller.avatar}
          alt={seller.name}
          width={120}
          height={120}
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{seller.name}</h1>
          <p className="mt-2 text-gray-600">{seller.bio}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Products</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {sellerProducts.map((product) => (
            <div key={product.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
