// app/page.tsx
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
      <div className="min-h-screen bg-[var(--hh-accent)] text-[var(--hh-text)]">
      
      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-5">
        {/* Hero */}
        <section className="grid items-center gap-5 md:grid-cols-1">
          {/* Hero Image */}
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm h-[260px] sm:h-[340px] md:h-[440px] lg:h-[480px]">
            <Image
              src="/havenhero.png"
              alt="Artisans showcasing handcrafted goods"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "50% 10%" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1152px"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-4xl leading-tight md:text-4xl">
              Unique, handcrafted treasures — made by real artisans.
            </h1>
            <p className="mt-4 max-w-prose text-lg text-black/70">
              Handcrafted Haven is a community marketplace where sellers share
              their story, list their creations, and connect with customers who
              value quality and sustainability.
            </p>
          </div>
        </section>

        {/* Big Click Boxes */}
        <section className="mt-7 grid gap-6 md:grid-cols-2">
          <Link
            href="/shop"
            className="group rounded-2xl border border-black/5 bg-[#EFE4D2] p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-[var(--font-display)] text-2xl">
              Shop handcrafted items
            </h2>
            <p className="mt-2 text-black/70">
              Browse by category, price range, or featured collections.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--hh-accent)] px-4 py-2 font-semibold">
              Go to Shop <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>

          <Link
            href="/sellers"
            className="group rounded-2xl border border-black/5 bg-[#EFE4D2] p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-[var(--font-display)] text-2xl">
              Explore seller profiles
            </h2>
            <p className="mt-2 text-black/70">
              Learn each artisan’s story and see their curated collections.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--hh-accent)] px-4 py-2 font-semibold">
              Go to Sellers{" "}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </Link>
        </section>

      </main>
    </div>
  );
}
