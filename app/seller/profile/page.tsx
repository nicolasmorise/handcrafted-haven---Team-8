import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type SellerRow = {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string;
};

export default async function SellerProfileEditPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "seller" || !user.seller_id) {
    redirect("/login");
  }

  const result = await pool.query<SellerRow>(
    `SELECT id, display_name, bio, avatar_url
     FROM sellers
     WHERE id = $1`,
    [user.seller_id]
  );

  const seller = result.rows[0];

  if (!seller) {
    redirect("/sellers");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Edit profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update how your seller profile appears to buyers.
        </p>

        <form
          className="mt-6 space-y-4"
          action="/api/seller/profile"
          method="post"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Display name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={seller.display_name}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={seller.bio ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="avatar_url"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar image path
            </label>
            <input
              id="avatar_url"
              name="avatar_url"
              type="text"
              defaultValue={seller.avatar_url}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Example: <code>/sellers/seller-1.webp</code>
            </p>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#7A9B76] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#688464] focus:outline-none focus:ring-2 focus:ring-[#7A9B76] focus:ring-offset-2"
          >
            Save changes
          </button>
        </form>
      </section>
    </main>
  );
}

