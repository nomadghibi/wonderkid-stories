"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminToggleTemplate({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/book-templates/${id}/toggle`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
    >
      {loading ? "…" : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
