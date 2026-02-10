import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type CategoryRow = {
  id: string;
  category_code: string;
};

export default async function NewProductPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "seller" || !user.seller_id) {
    redirect("/login");
  }

  const categoriesResult = await pool.query<CategoryRow>(
    `SELECT id, category_code
     FROM categories
     ORDER BY category_code`
  );

  const categories = categoriesResult.rows;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Add a new product</h1>
        <p className="mt-2 text-sm text-gray-600">
          List a new handcrafted item in your shop.
        </p>

        <form
          className="mt-6 space-y-4"
          action="/api/seller/products"
          method="post"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-gray-700"
            >
              Image path
            </label>
            <input
              id="image_url"
              name="image_url"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Example: <code>/products/ceramics/mug.webp</code>
            </p>
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_code}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#7A9B76] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#688464] focus:outline-none focus:ring-2 focus:ring-[#7A9B76] focus:ring-offset-2"
          >
            Add product
          </button>
        </form>
      </section>
    </main>
  );
}

