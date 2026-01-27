"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#7A9B76]">
      
      {/* TOP BAR */}
      <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-3 items-center">
        
        {/* LEFT */}
        <div className="flex items-center justify-start gap-3 text-sm p-12">
          {/* Mobile: hamburger */}
          <button
            className="sm:hidden text-xl"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>

          {/* Desktop: auth */}
          <div className="hidden sm:flex gap-2 p-">
            <Link href="/login" className="hover:underline">
              Sign in
            </Link>
            <span>or</span>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </div>
        </div>

        {/* CENTER: Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Handcrafted Haven logo"
              width={120}
              height={120}
              priority
            />
          </Link>
        </div>

        {/* RIGHT: Cart */}
        <div className="flex justify-end items-center p-12">
          <Link href="/cart">
            <Image
              src="/cart.png"
              alt="Cart"
              width={32}
              height={32}
            />
          </Link>
        </div>
      </div>

      {/* Desktop navbar */}
      <div className="hidden sm:block">
        <Navbar />
      </div>

      {/* Mobile menu */}
      <MobileMenu open={menuOpen} />
    </header>
  );
}
