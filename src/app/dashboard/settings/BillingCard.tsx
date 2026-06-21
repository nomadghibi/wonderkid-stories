"use client";

import { useState } from "react";

export default function BillingCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.mock) {
        setError("Billing portal requires Stripe to be configured.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Failed to open billing portal.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="font-bold text-[#24304A] mb-1">Billing</h2>
      <p className="text-sm text-gray-500 mb-4">
        View your purchase history, download receipts, and manage payment methods.
      </p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <button
        onClick={openPortal}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5b52e0] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
      >
        {loading ? "Opening…" : "Manage Billing →"}
      </button>
    </div>
  );
}
