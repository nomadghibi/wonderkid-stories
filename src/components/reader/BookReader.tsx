"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { BookPage } from "@/types/book";

interface Book {
  id: string;
  title: string | null;
  status: string;
  story_themes: { title: string; slug: string } | null;
  child_profiles: { name: string; age: number | null } | null;
}

interface BookReaderProps {
  book: Book;
  pages: BookPage[];
  canApprove: boolean;
  isCompleted: boolean;
}

export default function BookReader({ book, pages, canApprove, isCompleted }: BookReaderProps) {
  const router = useRouter();
  const storyPages = pages.filter((p) => p.page_type !== "dedication");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [approving, setApproving] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPage = storyPages[currentIndex];
  const totalPages = storyPages.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalPages - 1;

  async function handleApprove() {
    setApproving(true);
    try {
      const res = await fetch(`/api/books/${book.id}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Approval failed");
      setDownloadUrl(data.downloadUrl);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error approving book");
    } finally {
      setApproving(false);
    }
  }

  async function handleRequestChanges() {
    setSubmittingFeedback(true);
    try {
      await fetch(`/api/books/${book.id}/request-regeneration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "needs_changes", feedback }),
      });
      setFeedbackOpen(false);
      router.refresh();
    } finally {
      setSubmittingFeedback(false);
    }
  }

  async function handleDownload() {
    const res = await fetch(`/api/books/${book.id}/download`);
    const data = await res.json();
    if (data.url) window.open(data.url, "_blank");
  }

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">📖</div>
          <p>No pages found in this book.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-[#FFF8ED]" : ""} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div>
          <h1 className="font-extrabold text-[#24304A] text-base truncate max-w-xs">{book.title ?? "Your Storybook"}</h1>
          <p className="text-xs text-gray-400">{book.child_profiles?.name} · {book.story_themes?.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? "⊡" : "⛶"}
          </button>
          {!isFullscreen && (
            <a href="/dashboard/books" className="text-xs text-gray-500 hover:text-gray-700">← Library</a>
          )}
        </div>
      </div>

      {/* Main reader area */}
      <div className={`flex-1 flex flex-col md:flex-row ${isFullscreen ? "overflow-hidden" : ""}`}>
        {/* Illustration (70%) */}
        <div className="md:w-[70%] bg-gray-50 flex items-center justify-center relative" style={{ minHeight: isFullscreen ? "60vh" : "300px" }}>
          {currentPage.image_url ? (
            <div className="relative w-full h-full" style={{ minHeight: isFullscreen ? "60vh" : "320px" }}>
              <Image
                src={currentPage.image_url}
                alt={currentPage.title ?? `Page ${currentPage.page_number}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 p-8">
              <div className="text-6xl mb-3">🖼️</div>
              <p className="text-sm">Illustration loading...</p>
            </div>
          )}

          {/* Page type badge */}
          {currentPage.page_type === "cover" && (
            <div className="absolute top-3 left-3 bg-[#6C63FF] text-white text-xs font-bold px-2 py-1 rounded-full">Cover</div>
          )}
        </div>

        {/* Text (30%) */}
        <div className="md:w-[30%] bg-white flex flex-col p-6 md:p-8" style={{ minHeight: "200px" }}>
          {currentPage.title && (
            <h2 className="font-extrabold text-[#24304A] text-lg mb-3 leading-snug">{currentPage.title}</h2>
          )}
          <p
            className="text-[#24304A] leading-relaxed flex-1"
            style={{ fontSize: "22px", lineHeight: "1.6" }}
          >
            {currentPage.text_content ?? ""}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
          >
            ← Previous
          </button>

          {/* Page thumbnails */}
          <div className="flex items-center gap-1.5">
            {storyPages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all rounded-full ${i === currentIndex ? "w-3 h-3 bg-[#6C63FF]" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">{currentIndex + 1} / {totalPages}</span>

          <button
            onClick={() => setCurrentIndex((i) => Math.min(totalPages - 1, i + 1))}
            disabled={isLast}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Review actions */}
      {(canApprove || isCompleted || downloadUrl) && (
        <div className="bg-[#FFF8ED] border-t border-purple-100 px-4 py-4">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            {downloadUrl || isCompleted ? (
              <button
                onClick={handleDownload}
                className="flex-1 bg-[#06D6A0] hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                📥 Download PDF
              </button>
            ) : null}

            {canApprove && !downloadUrl && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="flex-1 bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {approving ? "⏳ Generating PDF..." : "✅ Approve & Download"}
                </button>
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  ✏️ Request Changes
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-extrabold text-[#24304A] text-lg mb-2">What would you like changed?</h3>
            <p className="text-sm text-gray-500 mb-4">Your feedback will be reviewed. We&apos;ll work on an improved version.</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="E.g. The story doesn't mention Emma's love of dolphins. Can you add that?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRequestChanges}
                disabled={submittingFeedback || !feedback.trim()}
                className="flex-1 bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors"
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>
              <button
                onClick={() => setFeedbackOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
