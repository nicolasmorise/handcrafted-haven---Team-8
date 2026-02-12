"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

type HeaderUser = {
  name: string | null;
  role: "buyer" | "seller";
  seller_public_id: string | null;
} | null;

type Props = {
  user: HeaderUser;
};

export default function Header({ user }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sellerMenuOpen, setSellerMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close seller dropdown when the route changes
  useEffect(() => {
    setSellerMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  const isSeller = user?.role === "seller";

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
          <div className="hidden sm:flex items-center gap-3">
            {!user && (
              <>
                <Link href="/login" className="hover:underline">
                  Sign in
                </Link>
                <span>|</span>
                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}

            {user && !isSeller && (
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  Welcome {user.name ?? "User"}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium hover:bg-white/20"
                >
                  Logout
                </button>
              </div>
            )}

            {user && isSeller && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSellerMenuOpen((open) => !open)}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium hover:bg-white/20"
                >
                  <span>Welcome {user.name ?? "Seller"}</span>
                  <span className="text-xs">▾</span>
                </button>
                {sellerMenuOpen && (
                  <div className="absolute left-0 mt-2 w-40 rounded-md border border-black/10 bg-white py-1 text-sm shadow-lg">
                    {user.seller_public_id && (
                      <Link
                        href={`/sellers/${user.seller_public_id}`}
                        className="block px-3 py-1 hover:bg-gray-100"
                        onClick={() => setSellerMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    )}
                    <Link
                      href="/seller/profile"
                      className="block px-3 py-1 hover:bg-gray-100"
                      onClick={() => setSellerMenuOpen(false)}
                    >
                      Edit profile
                    </Link>
                    <Link
                      href="/seller/products/new"
                      className="block px-3 py-1 hover:bg-gray-100"
                      onClick={() => setSellerMenuOpen(false)}
                    >
                      Add product
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSellerMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full px-3 py-1 text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
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
      <MobileMenu open={menuOpen} user={user} />
    </header>
  );
}
