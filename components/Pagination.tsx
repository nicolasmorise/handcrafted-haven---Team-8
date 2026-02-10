"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Pagination({ totalPages }: { totalPages: number }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentPage = Number(searchParams.get("page")) || 1;

    function createPageURL(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        return `${pathname}?${params.toString()}`;
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;

            return (
            <Link
                key={page}
                href={createPageURL(page)}
                className={`px-3 py-2 rounded-md text-sm border ${
                isActive
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100"
                }`}
            >
                {page}
            </Link>
            );
        })}
        </div>
    );
}