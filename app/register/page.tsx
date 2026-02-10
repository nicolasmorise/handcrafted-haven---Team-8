"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState("buyer");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Join Handcrafted Haven as a buyer, supporter, or future seller.
        </p>

        <form
          className="mt-6 space-y-4"
          method="post"
          action="/api/auth/register"
        >
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Account type
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          {role === "seller" && (
            <div>
              <label
                htmlFor="avatar_url"
                className="block text-sm font-medium text-gray-700"
              >
                Profile image path
              </label>
              <input
                id="avatar_url"
                name="avatar_url"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
                placeholder="/sellers/seller-1.webp"
              />
              <p className="mt-1 text-xs text-gray-500">
                Example: <code>/sellers/seller-1.webp</code> (optional)
              </p>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#7A9B76] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#688464] focus:outline-none focus:ring-2 focus:ring-[#7A9B76] focus:ring-offset-2"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#7A9B76] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

