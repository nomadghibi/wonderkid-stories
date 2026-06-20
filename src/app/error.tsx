"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-extrabold text-[#24304A] mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-2 text-sm">{error.message}</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={reset} className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Try again
          </button>
          <Link href="/dashboard" className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
