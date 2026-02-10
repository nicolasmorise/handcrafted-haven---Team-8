"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { code: "", label: "All" },
  { code: "woodworking", label: "Woodworking" },
  { code: "home_decor", label: "Home Decor" },
  { code: "ceramics", label: "Ceramics" },
  { code: "art", label: "Art" },
  { code: "textiles", label: "Textiles" },
  { code: "jewelry", label: "Jewelry" },
  { code: "writing", label: "Writing" },
];

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentCategory = searchParams.get("category") ?? "";

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams);

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.set("page", "1"); // future-proof for pagination
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full rounded-lg border sm:border-0 p-4 bg-white mb-8">
      <h2 className="font-semibold mb-4 text-left sm:text-center">
        Categories
      </h2>

      <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center pb-4">
        {CATEGORIES.map((cat) => (
          <li key={cat.code}>
            <button
              onClick={() => handleCategoryChange(cat.code)}
              className={`px-4 py-2 rounded-md text-sm transition whitespace-nowrap ${
                currentCategory === cat.code
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}