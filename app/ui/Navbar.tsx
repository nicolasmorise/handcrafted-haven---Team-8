"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#7A9B76] border-t border-black/10">
      <ul className="
        mx-auto max-w-7xl px-4
        flex flex-wrap gap-x-6 gap-y-2
        py-3
        text-sm font-medium
        justify-center sm:justify-start
      ">
        <li>
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
        </li>
        <li>
          <Link href="/sellers" className="hover:underline underline-offset-4">
            Sellers
          </Link>
        </li>
        <li>
          <Link href="/products" className="hover:underline underline-offset-4">
            Products
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
