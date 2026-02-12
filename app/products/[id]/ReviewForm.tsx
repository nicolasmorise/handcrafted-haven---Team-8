"use client";

import { useState } from "react";

type Props = {
  productId: string;
  existing?: {
    rating: number;
    comment: string;
  } | null;
};

export default function ReviewForm({ productId, existing }: Props) {
  const [rating, setRating] = useState<number>(existing?.rating ?? 5);
  const [comment, setComment] = useState<string>(existing?.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = !!existing;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to save review.");
      }

      // show updated review list
      window.location.href = `/products/${productId}#reviews`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {isEdit ? "Edit your review" : "Write a review"}
        </h3>
        {isEdit && <span className="text-xs text-gray-500">You already reviewed this product</span>}
      </div>

      <label className="block text-sm">
        Rating
        <select
          className="mt-1 block w-32 rounded-md border px-2 py-1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5,4,3,2,1].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Comment
        <textarea
          className="mt-1 block w-full rounded-md border px-3 py-2"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          minLength={10}
          maxLength={2000}
          placeholder="Share what you liked (10+ chars)…"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Submit review"}
      </button>
    </form>
  );
}
