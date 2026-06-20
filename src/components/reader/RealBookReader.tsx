"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { BookReaderData, BookReaderPage, FontSize, ReaderMode } from "@/types/reader";
import { FONT_SIZE_PX, FONT_SIZES } from "@/types/reader";

import BookCover from "./BookCover";
import BookSpread from "./BookSpread";
import BookPage from "./BookPage";
import PageTurnControls from "./PageTurnControls";
import ReaderProgress from "./ReaderProgress";
import ReaderToolbar from "./ReaderToolbar";
import WonderHandHint from "./WonderHandHint";

const LS_FONT_KEY = "wk_font_size_v1";

interface RealBookReaderProps {
  data: BookReaderData;
  bookId?: string;
  backHref?: string;
  backLabel?: string;
  // Review mode callbacks
  onApprove?: () => void;
  onRequestChanges?: (feedback: string) => void;
  // Final mode callbacks
  onDownload?: () => void;
  onShare?: () => void;
}

/** Sort pages into canonical reading order */
function sortPages(pages: BookReaderPage[]): BookReaderPage[] {
  return [...pages].sort((a, b) => {
    if (a.pageType === "cover") return -1;
    if (b.pageType === "cover") return 1;
    if (a.pageType === "dedication") return -1;
    if (b.pageType === "dedication") return 1;
    return a.pageNumber - b.pageNumber;
  });
}

export default function RealBookReader({
  data,
  bookId,
  backHref,
  backLabel,
  onApprove,
  onRequestChanges,
  onDownload,
  onShare,
}: RealBookReaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [animDir, setAnimDir] = useState<"next" | "prev" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("large");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [approving, setApproving] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const touchStartX = useRef(0);
  const pages = sortPages(data.pages);
  const total = pages.length;

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Restore saved font size
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_FONT_KEY) as FontSize | null;
      if (saved && FONT_SIZES.includes(saved)) setFontSize(saved);
    } catch { /* ignore */ }
  }, []);

  function handleFontSize(s: FontSize) {
    setFontSize(s);
    try { localStorage.setItem(LS_FONT_KEY, s); } catch { /* ignore */ }
  }

  // Navigation
  const step = isMobile ? 1 : 2;

  const goNext = useCallback(() => {
    const nextIdx = currentIdx + step;
    if (nextIdx >= total) return;
    setAnimDir("next");
    setAnimKey(k => k + 1);
    setCurrentIdx(nextIdx);
  }, [currentIdx, step, total]);

  const goPrev = useCallback(() => {
    const prevIdx = currentIdx - step;
    if (prevIdx < 0) return;
    setAnimDir("prev");
    setAnimKey(k => k + 1);
    setCurrentIdx(Math.max(0, prevIdx));
  }, [currentIdx, step]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, goNext, goPrev]);

  // Touch nav
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -48) goNext();
    else if (delta > 48) goPrev();
  }

  // Click zones on spread (left half = prev, right half = next)
  function onSpreadClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.35) goPrev();
    else if (x > rect.width * 0.65) goNext();
  }

  // Derived spread pages
  const leftPage: BookReaderPage | null = isMobile ? null : (pages[currentIdx] ?? null);
  const rightPage: BookReaderPage | null = isMobile ? null : (pages[currentIdx + 1] ?? null);
  const mobilePage: BookReaderPage | null = isMobile ? (pages[currentIdx] ?? null) : null;

  // Display page numbers (skip cover/dedication from count)
  const storyPages = pages.filter(p => p.pageType === "story");
  const totalStory = storyPages.length;

  function storyNum(page: BookReaderPage | null): number | undefined {
    if (!page || page.pageType !== "story") return undefined;
    return storyPages.findIndex(p => p.pageNumber === page.pageNumber) + 1;
  }

  const hasPrev = currentIdx > 0;
  const hasNext = isMobile ? currentIdx < total - 1 : currentIdx + step < total;

  // Actions
  async function handleApprove() {
    if (onApprove) { onApprove(); return; }
    if (!bookId) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/books/${bookId}/approve`, { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Approval failed");
      setDownloadUrl(d.downloadUrl);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setApproving(false);
    }
  }

  async function handleRequestChanges() {
    if (!feedbackText.trim()) return;
    if (onRequestChanges) { onRequestChanges(feedbackText); setFeedbackOpen(false); return; }
    if (!bookId) return;
    setSubmittingFeedback(true);
    try {
      await fetch(`/api/books/${bookId}/request-regeneration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "needs_changes", feedback: feedbackText }),
      });
      setFeedbackOpen(false);
      setFeedbackText("");
    } finally {
      setSubmittingFeedback(false);
    }
  }

  async function handleDownload() {
    if (onDownload) { onDownload(); return; }
    if (downloadUrl) { window.open(downloadUrl, "_blank"); return; }
    if (!bookId) return;
    const res = await fetch(`/api/books/${bookId}/download`);
    const d = await res.json();
    if (d.url) window.open(d.url, "_blank");
  }

  // ── Cover view ────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <BookCover
        title={data.title}
        childName={data.childName}
        coverImageUrl={data.coverImageUrl ?? pages.find(p => p.pageType === "cover")?.imageUrl}
        onOpen={() => setIsOpen(true)}
      />
    );
  }

  // ── Reader view ───────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col min-h-screen bg-[#FFF8ED]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <WonderHandHint />

      {/* Toolbar */}
      <ReaderToolbar
        title={data.title}
        childName={data.childName}
        mode={data.mode}
        fontSize={fontSize}
        onFontSize={handleFontSize}
        backHref={backHref}
        backLabel={backLabel}
      />

      {/* Sample mode notice */}
      {data.mode === "sample" && (
        <div className="bg-[#FFD166]/25 border-b border-[#FFD166]/50 text-center py-2 px-4">
          <p className="text-xs text-[#24304A] font-medium">
            📖 Sample preview — content is placeholder.{" "}
            <a
              href={data.templateSlug ? `/register?template=${data.templateSlug}` : "/register"}
              className="text-[#6C63FF] font-bold hover:underline"
            >
              Create your child's personalized version →
            </a>
          </p>
        </div>
      )}

      {/* Book area */}
      <div
        className="flex-1 flex items-center justify-center p-4 md:p-6"
        onClick={!isMobile ? onSpreadClick : undefined}
        style={{ cursor: !isMobile ? "pointer" : "default" }}
      >
        {isMobile ? (
          // ── Mobile: single page ──────────────────────────────────────────
          <div
            key={animKey}
            className={animDir === "next" ? "mobile-enter-next" : animDir === "prev" ? "mobile-enter-prev" : ""}
            style={{
              width: "100%",
              maxWidth: 480,
              height: "min(72vh, 620px)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <style>{`
              @keyframes mobileRight { from { transform: translateX(24px); opacity:0; } to { transform:translateX(0); opacity:1; } }
              @keyframes mobileLeft  { from { transform: translateX(-24px); opacity:0; } to { transform:translateX(0); opacity:1; } }
              .mobile-enter-next { animation: mobileRight 0.26s ease-out; }
              .mobile-enter-prev { animation: mobileLeft  0.26s ease-out; }
            `}</style>
            {mobilePage && (
              <BookPage
                page={mobilePage}
                fontSize={fontSize}
                bookId={bookId}
                side="single"
                displayNumber={storyNum(mobilePage)}
                totalPages={totalStory}
              />
            )}
          </div>
        ) : (
          // ── Desktop: two-page spread ─────────────────────────────────────
          <BookSpread
            leftPage={leftPage}
            rightPage={rightPage}
            fontSize={fontSize}
            bookId={bookId}
            displayNumbers={[storyNum(leftPage), storyNum(rightPage)]}
            totalStoryPages={totalStory}
            animKey={animKey}
            animDirection={animDir}
          />
        )}
      </div>

      {/* Nav bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <PageTurnControls
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
          <ReaderProgress
            current={isMobile ? currentIdx : Math.floor(currentIdx / 2)}
            total={isMobile ? total : Math.ceil(total / 2)}
            onChange={(i) => {
              const newIdx = isMobile ? i : i * 2;
              setAnimDir(newIdx > currentIdx ? "next" : "prev");
              setAnimKey(k => k + 1);
              setCurrentIdx(newIdx);
            }}
          />
        </div>
      </div>

      {/* Mode action bar */}
      <ActionBar
        mode={data.mode}
        templateSlug={data.templateSlug}
        approving={approving}
        downloadUrl={downloadUrl}
        onApprove={handleApprove}
        onRequestChanges={() => setFeedbackOpen(true)}
        onDownload={handleDownload}
        onShare={onShare}
        onReadAgain={() => { setCurrentIdx(0); setAnimDir(null); }}
      />

      {/* Feedback modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-extrabold text-[#24304A] text-lg mb-2">What would you like changed?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Describe what you&apos;d like updated. We&apos;ll work on an improved version.
            </p>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              rows={4}
              placeholder="E.g. Can you mention Emma's love of dolphins on page 3?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRequestChanges}
                disabled={submittingFeedback || !feedbackText.trim()}
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

// ── Action bar by mode ──────────────────────────────────────────────────────
interface ActionBarProps {
  mode: ReaderMode;
  templateSlug?: string;
  approving: boolean;
  downloadUrl: string | null;
  onApprove: () => void;
  onRequestChanges: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onReadAgain: () => void;
}

function ActionBar({
  mode,
  templateSlug,
  approving,
  downloadUrl,
  onApprove,
  onRequestChanges,
  onDownload,
  onShare,
  onReadAgain,
}: ActionBarProps) {
  if (mode === "sample") {
    return (
      <div className="bg-[#FFF8ED] border-t border-purple-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-[#24304A] text-sm">Love this adventure?</p>
            <p className="text-xs text-gray-500">Personalize it with your child's name, age, and photo. From $14.99.</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/themes"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-colors"
            >
              ← Browse
            </a>
            <a
              href={templateSlug ? `/register?template=${templateSlug}` : "/register"}
              className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              ✨ Create This Book
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "review") {
    return (
      <div className="bg-[#FFF8ED] border-t border-purple-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <p className="flex-1 text-sm text-gray-500 text-center sm:text-left">
            Happy with the story? Approve to generate your final PDF.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onRequestChanges}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold text-sm transition-colors"
            >
              ✏️ Request Changes
            </button>
            <button
              onClick={onApprove}
              disabled={approving}
              className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {approving ? "⏳ Generating..." : "✅ Approve Book"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // final
  return (
    <div className="bg-[#FFF8ED] border-t border-purple-100 px-4 py-4">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <p className="flex-1 text-sm text-gray-500 text-center sm:text-left">
          🎉 Your book is approved and ready!
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={onReadAgain}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-colors"
          >
            📖 Read Again
          </button>
          {onShare && (
            <button
              onClick={onShare}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-colors"
            >
              📤 Share
            </button>
          )}
          <button
            onClick={onDownload}
            className="bg-[#06D6A0] hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
