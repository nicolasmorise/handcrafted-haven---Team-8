"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PriceSort() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentSort = searchParams.get("sort") ?? "";

    function handleSortChange(value: string) {
        const params = new URLSearchParams(searchParams);

        if (value) {
        params.set("sort", value);
        } else {
        params.delete("sort");
        }

        params.set("page", "1"); // future pagination
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
        >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
        </select>
        </div>
    );
}