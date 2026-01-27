"use client";

import Link from "next/link";

type Props = {
  open: boolean;
};

export default function MobileMenu({ open }: Props) {
  if (!open) return null;

  return (
    <div className="sm:hidden bg-[#7A9B76] border-t border-black/10">
      <ul className="flex flex-col gap-4 px-4 py-4 text-sm font-medium">
        
        {/* Auth */}
        <li className="flex gap-2">
          <Link href="/login" className="hover:underline">
            Sign in
          </Link>
          <span>or</span>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </li>

        <hr className="border-black/20" />

        {/* Nav */}
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/sellers" className="hover:underline">
            Sellers
          </Link>
        </li>
        <li>
          <Link href="/products" className="hover:underline">
            Products
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
      </ul>
    </div>
  );
}
