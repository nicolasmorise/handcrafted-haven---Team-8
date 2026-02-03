import Link from "next/link";
import Image from "next/image";
import { sellers } from "../lib/data";

export default function SellersPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Our Sellers</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            href={`/sellers/${seller.slug}`}
            className="rounded-lg border p-4 transition hover:shadow-md"
          >
            <Image
              src={seller.avatar}
              alt={seller.name}
              width={80}
              height={80}
              className="mb-3 rounded-full"
            />
            <h2 className="text-lg font-semibold">{seller.name}</h2>
            <p className="text-sm text-gray-600">{seller.bio}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
