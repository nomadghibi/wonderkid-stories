"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RetryBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRetry() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${bookId}/generate`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Retry failed (${res.status})`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Retry failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleRetry}
        disabled={loading}
        className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? "⏳ Retrying..." : "🔄 Retry Generation"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
