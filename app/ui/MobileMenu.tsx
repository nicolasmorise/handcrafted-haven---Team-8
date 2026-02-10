"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  user: {
    role: "buyer" | "seller";
    seller_public_id: string | null;
  } | null;
};

export default function MobileMenu({ open, user }: Props) {
  const router = useRouter();

  if (!open) return null;

  const isSeller = user?.role === "seller";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="sm:hidden bg-[#7A9B76] border-t border-black/10">
      <ul className="flex flex-col gap-4 px-4 py-4 text-sm font-medium">
        {/* Auth */}
        <li className="flex flex-col gap-2">
          {!user && (
            <div className="flex gap-2">
              <Link href="/login" className="hover:underline">
                Sign in
              </Link>
              <span>or</span>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </div>
          )}

          {user && !isSeller && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium hover:bg-white/20"
            >
              Logout
            </button>
          )}

          {user && isSeller && (
            <div className="flex flex-col gap-1">
              {user.seller_public_id && (
                <Link
                  href={`/sellers/${user.seller_public_id}`}
                  className="hover:underline"
                >
                  Profile
                </Link>
              )}
              <Link href="/seller/profile" className="hover:underline">
                Edit profile
              </Link>
              <Link href="/seller/products/new" className="hover:underline">
                Add product
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 rounded-full bg-white/10 px-4 py-1 text-sm font-medium hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          )}
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
