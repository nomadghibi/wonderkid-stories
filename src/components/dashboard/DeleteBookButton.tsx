"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteBookButtonProps {
  bookId: string;
  redirectTo?: string;
  variant?: "icon" | "full";
}

export default function DeleteBookButton({
  bookId,
  redirectTo = "/dashboard/books",
  variant = "full",
}: DeleteBookButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Delete failed (${res.status})`);
      router.push(redirectTo);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete this book?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
        title="Delete book"
      >
        Delete
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
    >
      🗑 Delete Book
    </button>
  );
}
