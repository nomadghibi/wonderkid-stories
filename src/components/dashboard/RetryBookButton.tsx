"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function RetryBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}/generate`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        toast({ title: "Slow down!", description: "Generation limit reached. Try again in an hour.", variant: "error" });
        return;
      }
      if (!res.ok) {
        toast({ title: "Retry failed", description: data.error ?? `Error ${res.status}`, variant: "error" });
        return;
      }
      if (data.queued) {
        toast({ title: "Queued!", description: "Your book will generate shortly.", variant: "success" });
      }
      router.refresh();
    } catch {
      toast({ title: "Network error", description: "Please check your connection and try again.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRetry}
      disabled={loading}
      className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
    >
      {loading ? "⏳ Retrying..." : "🔄 Retry Generation"}
    </button>
  );
}
