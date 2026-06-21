"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { BookReaderData, BookReaderPage, FontSize, FontFamily } from "@/types/reader";
import { FONT_SIZE_PX, FONT_SIZES, FONT_FAMILIES } from "@/types/reader";

import BookCover from "./BookCover";
import BookSpread from "./BookSpread";
import BookPage from "./BookPage";
import FontSizeControls from "./FontSizeControls";
import FontFamilyControls from "./FontFamilyControls";
import ReaderProgress from "./ReaderProgress";
import WonderHandHint from "./WonderHandHint";
import { updateStreak } from "@/lib/streak";
import { addSession, finishBook, getStats } from "@/lib/stats";
import { checkAndUnlock, getUnlocked, type Achievement } from "@/lib/achievements";
import AchievementToast from "./AchievementToast";
import PostBookScreen from "./PostBookScreen";
import ShortcutModal from "./ShortcutModal";

const LS_SIZE = "wk_font_size_v1";
const LS_FAMILY = "wk_font_family_v1";
const LS_NIGHT = "wk_night_mode";
const LS_DYSLEXIA = "wk_dyslexia";
const TTS_RATES = [0.8, 1, 1.25, 1.5];

interface TtsHighlight {
  pageIdx: number;
  field: "title" | "text";
  charStart: number;
  charEnd: number;
}

interface RealBookReaderProps {
  data: BookReaderData;
  bookId?: string;
  backHref?: string;
  backLabel?: string;
  onApprove?: () => void;
  onRequestChanges?: (feedback: string) => void;
  onDownload?: () => void;
  onShare?: () => void;
}

function sortPages(pages: BookReaderPage[]): BookReaderPage[] {
  return [...pages].sort((a, b) => {
    if (a.pageType === "cover" && b.pageType !== "cover") return -1;
    if (b.pageType === "cover" && a.pageType !== "cover") return 1;
    if (a.pageType === "dedication" && b.pageType !== "dedication") return -1;
    if (b.pageType === "dedication" && a.pageType !== "dedication") return 1;
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
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("large");
  const [fontFamily, setFontFamily] = useState<FontFamily>("nunito");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [approving, setApproving] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [savedProgress, setSavedProgress] = useState<number | null>(null);
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsRate, setTtsRate] = useState(1);
  const [ttsHighlight, setTtsHighlight] = useState<TtsHighlight | null>(null);
  const [streakCount, setStreakCount] = useState<number | null>(null);
  const [nightMode, setNightMode] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [autoRate, setAutoRate] = useState<number | null>(null);
  const [autoProgress, setAutoProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const touchStartX = useRef(0);
  const goNextRef = useRef<() => void>(() => {});
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef(0);
  const pagesReadRef = useRef(0);
  const wasOpenRef = useRef(false);
  const lsProgress = `wk_progress_${data.id}`;
  const lsBookmarks = `wk_bookmarks_${data.id}`;
  const pages = sortPages(data.pages);
  const total = pages.length;
  const isImageOnlyBook = pages.every(p => p.hasEmbeddedText || p.layoutType === "full_page" || p.layoutType === "image_only" || p.pageType === "certificate");

  // Hydration guard — prevents SSR mismatch on isOpen
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);

    try {
      const s = localStorage.getItem(LS_SIZE) as FontSize | null;
      if (s && FONT_SIZES.includes(s)) setFontSize(s);
      const f = localStorage.getItem(LS_FAMILY) as FontFamily | null;
      if (f && FONT_FAMILIES.includes(f)) setFontFamily(f);
      const prog = localStorage.getItem(`wk_progress_${data.id}`);
      if (prog) {
        const idx = parseInt(prog, 10);
        if (!isNaN(idx) && idx > 0 && idx < data.pages.length) {
          setSavedProgress(idx);
          setCurrentIdx(idx);
        }
      }
      if (localStorage.getItem(LS_NIGHT) === "1") setNightMode(true);
      if (localStorage.getItem(LS_DYSLEXIA) === "1") setDyslexiaMode(true);
      const bms = localStorage.getItem(`wk_bookmarks_${data.id}`);
      if (bms) setBookmarks(JSON.parse(bms) as number[]);
    } catch { /* private mode */ }

    return () => mq.removeEventListener("change", h);
  }, []);

  const step = isMobile ? 1 : 2;

  const goNext = useCallback(() => {
    if (currentIdx + step >= total) {
      setShowCompletion(true);
      return;
    }
    setAnimDir("next");
    setAnimKey(k => k + 1);
    setCurrentIdx(i => Math.min(i + step, total - 1));
  }, [currentIdx, step, total]);

  const goPrev = useCallback(() => {
    if (currentIdx === 0) return;
    setAnimDir("prev");
    setAnimKey(k => k + 1);
    setCurrentIdx(i => Math.max(0, i - step));
  }, [currentIdx, step]);

  // Keyboard — ref-based so handler always has fresh closures without re-registering
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandlerRef.current = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === "ArrowRight") goNext();
    else if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "Escape") {
      if (showShortcuts) setShowShortcuts(false);
      else if (backHref) window.location.href = backHref;
    }
    else if (e.key === "f" || e.key === "F") toggleFullscreen();
    else if (e.key === "n" || e.key === "N") setNightMode(m => !m);
    else if (e.key === "d" || e.key === "D") setDyslexiaMode(m => !m);
    else if (e.key === "b" || e.key === "B") toggleBookmark();
    else if (e.key === "r" || e.key === "R") setTtsActive(a => !a);
    else if (e.key === "?") setShowShortcuts(s => !s);
  };
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen]);

  // Lock body scroll when reader is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Keep goNextRef current so TTS onend can call it without stale closure
  useEffect(() => { goNextRef.current = goNext; }, [goNext]);

  // Persist reading progress per book
  useEffect(() => {
    if (!mounted) return;
    try {
      if (currentIdx > 0) localStorage.setItem(lsProgress, String(currentIdx));
      else localStorage.removeItem(lsProgress);
    } catch { /* ignore */ }
  }, [currentIdx, mounted, lsProgress]);

  // TTS: read current spread aloud with word highlighting, auto-advance when done
  useEffect(() => {
    if (!ttsActive || !mounted || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setTtsHighlight(null);

    // Build segment map so onboundary can map charIndex → page + field
    type Seg = { pageIdx: number; field: "title" | "text"; utterStart: number; utterEnd: number };
    const segments: Seg[] = [];
    const parts: string[] = [];
    let offset = 0;
    const SEP = ". ";

    const spread = isMobile ? [pages[currentIdx]] : [pages[currentIdx], pages[currentIdx + 1]];
    spread.filter(Boolean).forEach((page, i) => {
      const pageIdx = currentIdx + i;
      for (const field of ["title", "text"] as const) {
        const t = page![field];
        if (!t) continue;
        if (parts.length > 0) offset += SEP.length;
        segments.push({ pageIdx, field, utterStart: offset, utterEnd: offset + t.length });
        parts.push(t);
        offset += t.length;
      }
    });

    const text = parts.join(SEP);
    const atEnd = currentIdx + step >= total;

    if (!text.trim()) {
      if (atEnd) setTtsActive(false);
      else goNextRef.current();
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = ttsRate;
    utter.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name !== "word") return;
      const seg = segments.find(s => e.charIndex >= s.utterStart && e.charIndex < s.utterEnd);
      if (!seg) return;
      setTtsHighlight({
        pageIdx: seg.pageIdx,
        field: seg.field,
        charStart: e.charIndex - seg.utterStart,
        charEnd: e.charIndex - seg.utterStart + (e.charLength ?? 1),
      });
    };
    utter.onend = () => {
      setTtsHighlight(null);
      if (atEnd) setTtsActive(false);
      else goNextRef.current();
    };
    window.speechSynthesis.speak(utter);

    return () => {
      window.speechSynthesis.cancel();
      setTtsHighlight(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsActive, currentIdx, ttsRate, mounted, isMobile, step, total]);

  // Stop TTS when reader closes
  useEffect(() => {
    if (!isOpen && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setTtsActive(false);
    }
  }, [isOpen]);

  // Update reading streak when reader opens for the first time this session
  const streakUpdatedRef = useRef(false);
  useEffect(() => {
    if (isOpen && mounted && !streakUpdatedRef.current) {
      streakUpdatedRef.current = true;
      try {
        const d = updateStreak();
        setStreakCount(d.count);
      } catch { /* ignore */ }
    }
  }, [isOpen, mounted]);

  // Persist night mode preference
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(LS_NIGHT, nightMode ? "1" : "0"); } catch { /* ignore */ }
  }, [nightMode, mounted]);

  // Persist dyslexia mode preference
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(LS_DYSLEXIA, dyslexiaMode ? "1" : "0"); } catch { /* ignore */ }
  }, [dyslexiaMode, mounted]);

  // Session tracking for reading stats
  useEffect(() => {
    if (!mounted) return;
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      sessionStartRef.current = Date.now();
      pagesReadRef.current = 0;
    } else if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      const seconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
      if (seconds > 5) {
        try {
          const updated = addSession(pagesReadRef.current, seconds);
          const streak = streakCount ?? 0;
          const newly = checkAndUnlock({
            sessions: updated.totalSessions,
            pagesRead: updated.totalPagesRead,
            booksFinished: updated.booksFinished,
            streakCount: streak,
            nightMode,
            hasBookmark: bookmarks.length > 0,
          });
          if (newly.length > 0) setNewAchievements(prev => [...prev, ...newly]);
        } catch { /* ignore */ }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mounted]);

  // Count pages turned in this session
  useEffect(() => {
    if (!mounted || !isOpen) return;
    pagesReadRef.current += step;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  // Fullscreen API sync
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Auto-advance timer — reset on page change, pause during TTS
  useEffect(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    setAutoProgress(0);
    if (!autoRate || !isOpen || ttsActive) return;

    const tickMs = 100;
    const totalTicks = (autoRate * 1000) / tickMs;
    let tick = 0;
    autoTimerRef.current = setInterval(() => {
      tick++;
      setAutoProgress((tick / totalTicks) * 100);
      if (tick >= totalTicks) {
        clearInterval(autoTimerRef.current!);
        goNextRef.current();
      }
    }, tickMs);

    return () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRate, currentIdx, isOpen, ttsActive]);

  // Achievement checks — run whenever relevant state changes
  useEffect(() => {
    if (!mounted) return;
    const stats = getStats();
    const newly = checkAndUnlock({
      sessions: stats.totalSessions,
      pagesRead: stats.totalPagesRead,
      booksFinished: stats.booksFinished,
      streakCount: streakCount ?? 0,
      nightMode,
      hasBookmark: bookmarks.length > 0,
    });
    if (newly.length > 0) setNewAchievements(prev => [...prev, ...newly]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, streakCount, nightMode, bookmarks.length]);

  // When completion screen shows, record book finished + check achievements
  const completionFiredRef = useRef(false);
  useEffect(() => {
    if (!showCompletion || !mounted || completionFiredRef.current) return;
    completionFiredRef.current = true;
    try {
      const updated = finishBook();
      const newly = checkAndUnlock({
        sessions: updated.totalSessions,
        pagesRead: updated.totalPagesRead,
        booksFinished: updated.booksFinished,
        streakCount: streakCount ?? 0,
        nightMode,
        hasBookmark: bookmarks.length > 0,
      });
      if (newly.length > 0) setNewAchievements(prev => [...prev, ...newly]);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompletion, mounted]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -48) goNext();
    else if (delta > 48) goPrev();
  }

  // Split on viewport center: left half → prev, right half → next
  // (container-relative % breaks on wide screens where book is capped at 1080px)
  function onSpreadClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.clientX < window.innerWidth / 2) goPrev();
    else goNext();
  }

  function saveFontSize(s: FontSize) {
    setFontSize(s);
    try { localStorage.setItem(LS_SIZE, s); } catch { /* ignore */ }
  }
  function saveFontFamily(f: FontFamily) {
    setFontFamily(f);
    try { localStorage.setItem(LS_FAMILY, f); } catch { /* ignore */ }
  }

  // Page labelling helpers
  const storyPages = pages.filter(p => p.pageType === "story");
  const totalStory = storyPages.length;

  function storyNum(page: BookReaderPage | null): number | undefined {
    if (!page || page.pageType !== "story") return undefined;
    return storyPages.findIndex(p => p.pageNumber === page.pageNumber) + 1;
  }

  function pageLabel(page: BookReaderPage | null): string | undefined {
    if (!page) return undefined;
    const n = storyNum(page);
    if (n !== undefined) return `${n} of ${totalStory}`;
    if (page.pageType === "cover") return "Cover";
    if (page.pageType === "dedication") return "Dedication";
    if (page.pageType === "certificate") return "Certificate";
    return undefined;
  }

  // Spread counter text e.g. "Pages 2–3 of 10"
  function spreadCounterText(): string {
    if (isMobile) {
      const p = pages[currentIdx];
      if (!p) return "";
      if (p.pageType === "cover") return "Cover";
      if (p.pageType === "dedication") return "Dedication";
      if (p.pageType === "certificate") return "Certificate";
      if (isImageOnlyBook) return `Page ${currentIdx} of ${total - 1}`;
      const n = storyNum(p);
      if (n !== undefined) return `Page ${n} of ${totalStory}`;
      return "Reading…";
    }
    const left = pages[currentIdx];
    const right = pages[currentIdx + 1];
    if (isImageOnlyBook) {
      const ln = left?.pageType === "cover" ? "Cover" : String(currentIdx);
      const rn = right ? (right.pageType === "certificate" ? "Certificate" : String(currentIdx + 1)) : null;
      if (left?.pageType === "cover") return rn ? `Cover & Page 1` : "Cover";
      if (!right) return `Page ${ln} of ${total - 1}`;
      return `Pages ${ln}–${rn} of ${total - 1}`;
    }
    const ln = storyNum(left);
    const rn = storyNum(right);
    if (ln !== undefined && rn !== undefined) return `Pages ${ln}–${rn} of ${totalStory}`;
    if (ln !== undefined) return `Page ${ln} of ${totalStory}`;
    if (left?.pageType === "cover") return right ? "Cover & Page 1" : "Cover";
    return "Reading…";
  }

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
    } catch (e) { alert(e instanceof Error ? e.message : "Error"); }
    finally { setApproving(false); }
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
    } finally { setSubmittingFeedback(false); }
  }

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: data.title,
      text: `Read "${data.title}" — a free interactive children's book on WonderKid Stories!`,
      url,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch { /* user cancelled */ return; }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch { /* ignore */ }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function handleBookFinished() {
    try {
      const updated = finishBook();
      const streak = streakCount ?? 0;
      const newly = checkAndUnlock({
        sessions: updated.totalSessions,
        pagesRead: updated.totalPagesRead,
        booksFinished: updated.booksFinished,
        streakCount: streak,
        nightMode,
        hasBookmark: bookmarks.length > 0,
      });
      return newly;
    } catch { return []; }
  }

  function toggleBookmark() {
    setBookmarks(prev => {
      const next = prev.includes(currentIdx)
        ? prev.filter(i => i !== currentIdx)
        : [...prev, currentIdx].sort((a, b) => a - b);
      try { localStorage.setItem(lsBookmarks, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  // Compute per-page tts highlight props for BookPage
  function pageHighlightProps(page: BookReaderPage | null, idx: number) {
    if (!page || !ttsHighlight || ttsHighlight.pageIdx !== idx) return {};
    if (ttsHighlight.field === "text") return { textHighlight: { charStart: ttsHighlight.charStart, charEnd: ttsHighlight.charEnd } };
    return { titleHighlight: { charStart: ttsHighlight.charStart, charEnd: ttsHighlight.charEnd } };
  }

  async function handleDownload() {
    if (onDownload) { onDownload(); return; }
    if (downloadUrl) { window.open(downloadUrl, "_blank"); return; }
    if (!bookId) return;
    const res = await fetch(`/api/books/${bookId}/download`);
    const d = await res.json();
    if (d.url) window.open(d.url, "_blank");
  }

  // Before mount, render nothing to avoid SSR flash
  if (!mounted) return null;

  // ── Cover ─────────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <BookCover
        title={data.title}
        childName={data.childName}
        coverImageUrl={data.coverImageUrl ?? pages.find(p => p.pageType === "cover")?.imageUrl}
        isImageOnly={isImageOnlyBook}
        onOpen={() => setIsOpen(true)}
        backHref={backHref}
        backLabel={backLabel}
        resumePageIdx={savedProgress ?? undefined}
        totalPages={total}
        onStartOver={savedProgress ? () => {
          setCurrentIdx(0);
          setSavedProgress(null);
          try { localStorage.removeItem(lsProgress); } catch { /* ignore */ }
          setIsOpen(true);
        } : undefined}
      />
    );
  }

  // ── Reader ────────────────────────────────────────────────────────────────
  const leftPage = isMobile ? null : (pages[currentIdx] ?? null);
  const rightPage = isMobile ? null : (pages[currentIdx + 1] ?? null);
  const mobilePage = isMobile ? (pages[currentIdx] ?? null) : null;
  const hasPrev = currentIdx > 0;
  const hasNext = isMobile ? currentIdx < total - 1 : currentIdx + step < total;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
      style={{ background: nightMode ? "#1a1612" : "#FFF8ED" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <WonderHandHint />

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          background: nightMode ? "rgba(16,12,8,0.92)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderColor: nightMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
        }}
      >
        {/* Left: back */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {backHref && (
            <a
              href={backHref}
              className="text-sm font-semibold text-[#6C63FF] hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0"
            >
              ← {backLabel ?? "Back"}
            </a>
          )}
          <span
            className="text-sm font-extrabold truncate hidden sm:block"
            style={{ color: nightMode ? "#e8d5b0" : "#24304A" }}
          >
            {data.title}
          </span>
          {data.childName && (
            <span className="text-xs text-gray-400 hidden md:block">· {data.childName}</span>
          )}
          {streakCount && streakCount > 0 && (
            <span
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full flex-shrink-0"
              title={`${streakCount}-day reading streak`}
            >
              🔥 {streakCount}
            </span>
          )}
          <button
            onClick={handleShare}
            title="Share this book"
            className="hidden sm:flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border transition-all flex-shrink-0"
            style={{
              borderColor: shareCopied ? "#06D6A0" : (nightMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
              color: shareCopied ? "#06D6A0" : (nightMode ? "#a89070" : "#6b7280"),
            }}
          >
            {shareCopied ? "✓ Copied" : "📤 Share"}
          </button>
        </div>

        {/* Center: mode badge */}
        <div className="flex-shrink-0 mx-3">
          {data.mode === "library" && (
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              Free Library
            </span>
          )}
          {data.mode === "sample" && (
            <span className="text-xs font-bold bg-[#FFD166]/30 text-yellow-700 px-2.5 py-1 rounded-full">
              Preview
            </span>
          )}
          {data.mode === "review" && (
            <span className="text-xs font-bold bg-purple-100 text-[#6C63FF] px-2.5 py-1 rounded-full">
              Review
            </span>
          )}
          {data.mode === "final" && (
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
              Approved
            </span>
          )}
        </div>

        {/* Right: night mode + font controls + TTS */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-1 justify-end">
          {/* Auto-advance */}
          <select
            value={autoRate ?? "off"}
            onChange={e => setAutoRate(e.target.value === "off" ? null : Number(e.target.value))}
            title="Auto-advance speed"
            className="text-xs border rounded-lg px-1.5 py-1 focus:outline-none hidden sm:block"
            style={{
              borderColor: autoRate ? "#6C63FF" : (nightMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
              color: autoRate ? "#6C63FF" : (nightMode ? "#a89070" : "#6b7280"),
              background: nightMode ? "rgba(255,255,255,0.06)" : "white",
            }}
          >
            <option value="off">⏱ Off</option>
            <option value="40">Slow</option>
            <option value="25">Normal</option>
            <option value="12">Fast</option>
          </select>

          {/* Dyslexia mode */}
          <button
            onClick={() => setDyslexiaMode(d => !d)}
            title={dyslexiaMode ? "Turn off dyslexia-friendly mode (D)" : "Dyslexia-friendly reading mode (D)"}
            className="text-xs font-extrabold px-2 py-1 rounded-lg border transition-all hidden sm:block"
            style={{
              borderColor: dyslexiaMode ? "#06D6A0" : (nightMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
              color: dyslexiaMode ? "#06D6A0" : (nightMode ? "#a89070" : "#6b7280"),
              background: dyslexiaMode ? "rgba(6,214,160,0.08)" : (nightMode ? "rgba(255,255,255,0.06)" : "transparent"),
            }}
          >
            Aa
          </button>

          {/* Night mode */}
          <button
            onClick={() => setNightMode(n => !n)}
            title={nightMode ? "Switch to day mode" : "Switch to night mode"}
            className="text-base leading-none px-2 py-1 rounded-lg border transition-all"
            style={{
              borderColor: nightMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
              background: nightMode ? "rgba(255,255,255,0.06)" : "transparent",
            }}
          >
            {nightMode ? "☀️" : "🌙"}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="text-base leading-none px-2 py-1 rounded-lg border transition-all hidden sm:block"
            style={{
              borderColor: nightMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
              background: nightMode ? "rgba(255,255,255,0.06)" : "transparent",
            }}
          >
            {isFullscreen ? "⊡" : "⛶"}
          </button>

          {/* Keyboard shortcut help */}
          <button
            onClick={() => setShowShortcuts(s => !s)}
            title="Keyboard shortcuts (?)"
            className="text-xs font-bold w-6 h-6 rounded-full border flex items-center justify-center hidden sm:flex transition-all"
            style={{
              borderColor: showShortcuts ? "#6C63FF" : (nightMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
              color: showShortcuts ? "#6C63FF" : (nightMode ? "#a89070" : "#9ca3af"),
              background: showShortcuts ? "rgba(108,99,255,0.08)" : "transparent",
            }}
          >
            ?
          </button>

          {isImageOnlyBook ? (
            <span className="text-xs text-gray-400 hidden sm:block" title="Text size is fixed for image pages.">
              🖼 Image pages
            </span>
          ) : (
            <>
              <FontFamilyControls value={fontFamily} onChange={saveFontFamily} />
              <FontSizeControls fontSize={fontSize} onChange={saveFontSize} />
              <div className="flex items-center gap-1">
                {ttsActive && (
                  <select
                    value={ttsRate}
                    onChange={e => setTtsRate(Number(e.target.value))}
                    className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]/30 hidden sm:block"
                    title="Reading speed"
                  >
                    {TTS_RATES.map(r => (
                      <option key={r} value={r}>{r}×</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => setTtsActive(a => !a)}
                  title={ttsActive ? "Stop reading aloud" : "Read aloud"}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    ttsActive
                      ? "bg-[#6C63FF] text-white shadow-sm"
                      : "border border-gray-200 text-gray-500 hover:border-[#6C63FF] hover:text-[#6C63FF]"
                  }`}
                >
                  {ttsActive ? "⏸ Stop" : "🔊 Read"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Sample banner ─────────────────────────────────────────────────── */}
      {data.mode === "sample" && (
        <div
          className="flex-shrink-0 text-center py-1.5 px-4 text-xs font-medium text-[#24304A]"
          style={{ background: "rgba(255,209,102,0.25)", borderBottom: "1px solid rgba(255,209,102,0.5)" }}
        >
          📖 Sample preview —{" "}
          <a
            href={data.templateSlug ? `/register?template=${data.templateSlug}` : "/register"}
            className="text-[#6C63FF] font-bold hover:underline"
          >
            Create your child's personalized version →
          </a>
        </div>
      )}

      {/* ── Book area ─────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onClick={!isMobile ? onSpreadClick : undefined}
        style={{ padding: isMobile ? "8px" : "16px 24px 8px", cursor: !isMobile ? "pointer" : "default" }}
      >
        {isMobile ? (
          // Single page (mobile)
          <div
            key={animKey}
            className={animDir === "next" ? "mob-next" : animDir === "prev" ? "mob-prev" : ""}
            style={{
              width: "100%",
              maxWidth: 460,
              height: "100%",
              maxHeight: 580,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <style>{`
              @keyframes mobR { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
              @keyframes mobL { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
              .mob-next{animation:mobR 0.22s cubic-bezier(.22,1,.36,1)}
              .mob-prev{animation:mobL 0.22s cubic-bezier(.22,1,.36,1)}
            `}</style>
            {mobilePage && (
              <BookPage
                page={mobilePage}
                fontSize={fontSize}
                fontFamily={fontFamily}
                bookId={bookId}
                side="single"
                pageLabel={pageLabel(mobilePage)}
                nightMode={nightMode}
                dyslexiaMode={dyslexiaMode}
                {...pageHighlightProps(mobilePage, currentIdx)}
              />
            )}
          </div>
        ) : (
          // Two-page spread (desktop)
          <BookSpread
            leftPage={leftPage}
            rightPage={rightPage}
            fontSize={fontSize}
            fontFamily={fontFamily}
            bookId={bookId}
            leftLabel={pageLabel(leftPage)}
            rightLabel={pageLabel(rightPage)}
            animKey={animKey}
            animDirection={animDir}
            nightMode={nightMode}
            dyslexiaMode={dyslexiaMode}
            leftHighlight={pageHighlightProps(leftPage, currentIdx)}
            rightHighlight={pageHighlightProps(rightPage, currentIdx + 1)}
          />
        )}
      </div>

      {/* ── Auto-advance progress bar ─────────────────────────────────────── */}
      {autoRate && autoProgress > 0 && (
        <div className="flex-shrink-0 h-0.5" style={{ background: nightMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
          <div
            className="h-full bg-[#6C63FF] transition-none"
            style={{ width: `${autoProgress}%` }}
          />
        </div>
      )}

      {/* ── Navigation bar ────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 border-t"
        style={{
          background: nightMode ? "rgba(16,12,8,0.92)" : "rgba(255,255,255,0.9)",
          borderColor: nightMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Prev */}
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-sm font-bold transition-all active:scale-95"
            style={{
              borderColor: hasPrev ? "#6C63FF" : (nightMode ? "#333" : "#E5E7EB"),
              color: hasPrev ? "#6C63FF" : (nightMode ? "#555" : "#9CA3AF"),
              opacity: hasPrev ? 1 : 0.4,
              cursor: hasPrev ? "pointer" : "not-allowed",
            }}
          >
            ← Prev
          </button>

          {/* Counter + dots + bookmark */}
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold whitespace-nowrap"
                style={{ color: nightMode ? "#a89070" : "#6b7280" }}
              >
                {spreadCounterText()}
              </span>
              {/* Bookmark toggle */}
              <button
                onClick={toggleBookmark}
                title={bookmarks.includes(currentIdx) ? "Remove bookmark" : "Bookmark page"}
                className="text-base leading-none transition-transform active:scale-90 hover:scale-110"
              >
                {bookmarks.includes(currentIdx) ? "🔖" : "📄"}
              </button>
              {/* Bookmark list button */}
              {bookmarks.length > 0 && (
                <button
                  onClick={() => setShowBookmarks(s => !s)}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border"
                  style={{
                    color: "#6C63FF",
                    borderColor: showBookmarks ? "#6C63FF" : "rgba(108,99,255,0.3)",
                    background: showBookmarks ? "rgba(108,99,255,0.08)" : "transparent",
                  }}
                >
                  {bookmarks.length}
                </button>
              )}
            </div>
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

          {/* Next */}
          <button
            onClick={goNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-sm font-bold transition-all active:scale-95"
            style={{
              borderColor: hasNext ? "#6C63FF" : (nightMode ? "#333" : "#E5E7EB"),
              color: hasNext ? "#6C63FF" : (nightMode ? "#555" : "#9CA3AF"),
              opacity: hasNext ? 1 : 0.4,
              cursor: hasNext ? "pointer" : "not-allowed",
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ── Bookmark panel ────────────────────────────────────────────────── */}
      {showBookmarks && bookmarks.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-[70] flex justify-center"
          style={{ paddingBottom: "var(--nav-height, 60px)" }}
        >
          <div
            className="mx-4 mb-1 rounded-2xl shadow-2xl border overflow-hidden w-full max-w-sm"
            style={{
              background: nightMode ? "#1e1a14" : "white",
              borderColor: nightMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: nightMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
            >
              <span
                className="text-xs font-extrabold"
                style={{ color: nightMode ? "#e8d5b0" : "#24304A" }}
              >
                🔖 Bookmarks
              </span>
              <button
                onClick={() => setShowBookmarks(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {bookmarks.map(idx => {
                const p = pages[idx];
                if (!p) return null;
                const label = pageLabel(p) ?? p.title ?? `Page ${idx + 1}`;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setAnimDir(idx > currentIdx ? "next" : "prev");
                      setAnimKey(k => k + 1);
                      setCurrentIdx(idx);
                      setShowBookmarks(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm border-b flex items-center gap-3 transition-colors hover:bg-black/5"
                    style={{
                      borderColor: nightMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                      color: nightMode ? "#e8d5b0" : "#24304A",
                    }}
                  >
                    <span className="text-base">📄</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold truncate block">{p.title ?? "Untitled"}</span>
                      <span className="text-[10px] text-gray-400">{label}</span>
                    </div>
                    {idx === currentIdx && (
                      <span className="text-[10px] font-bold text-[#6C63FF]">here</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Post-book completion screen ───────────────────────────────────── */}
      {showCompletion && (
        <PostBookScreen
          title={data.title}
          newAchievements={newAchievements}
          mode={data.mode}
          templateSlug={data.templateSlug}
          backHref={backHref}
          onReadAgain={() => {
            setCurrentIdx(0);
            setAnimDir(null);
            setShowCompletion(false);
            setNewAchievements([]);
            completionFiredRef.current = false;
          }}
          onDismiss={() => {
            setShowCompletion(false);
            setNewAchievements([]);
          }}
        />
      )}

      {/* ── Keyboard shortcut modal ───────────────────────────────────────── */}
      {showShortcuts && (
        <ShortcutModal onClose={() => setShowShortcuts(false)} nightMode={nightMode} />
      )}

      {/* ── Achievement toast ─────────────────────────────────────────────── */}
      {!showCompletion && newAchievements.length > 0 && (
        <AchievementToast
          achievements={newAchievements}
          onDone={() => setNewAchievements([])}
        />
      )}

      {/* ── Mode action bar ───────────────────────────────────────────────── */}
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

      {/* ── Feedback modal ────────────────────────────────────────────────── */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-extrabold text-[#24304A] text-lg mb-2">What would you like changed?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Describe what you&apos;d like updated — we&apos;ll work on an improved version.
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
                {submittingFeedback ? "Submitting…" : "Submit Feedback"}
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

// ── Mode action bars ──────────────────────────────────────────────────────────
type ActionBarProps = {
  mode: string;
  templateSlug?: string;
  approving: boolean;
  downloadUrl: string | null;
  onApprove: () => void;
  onRequestChanges: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onReadAgain: () => void;
};

function ActionBar({
  mode, templateSlug, approving, downloadUrl,
  onApprove, onRequestChanges, onDownload, onShare, onReadAgain,
}: ActionBarProps) {
  const baseStyle: React.CSSProperties = {
    background: "rgba(255,248,237,0.95)",
    borderTop: "1px solid rgba(108,99,255,0.12)",
    padding: "10px 16px",
    flexShrink: 0,
  };

  if (mode === "library") {
    return (
      <div style={baseStyle}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
          <p className="flex-1 text-sm text-gray-500 text-center sm:text-left">
            📚 Free library book — enjoy the story!
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onReadAgain}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white font-semibold text-sm transition-colors"
            >
              📖 Read Again
            </button>
            <a
              href="/library"
              className="px-5 py-2 rounded-xl text-white font-bold text-sm transition-colors"
              style={{ background: "#6C63FF" }}
            >
              📚 More Books
            </a>
            <a
              href="/themes"
              className="px-5 py-2 rounded-xl text-white font-bold text-sm transition-colors"
              style={{ background: "#06D6A0" }}
            >
              ✨ Get Your Own
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "sample") {
    return (
      <div style={baseStyle}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex-1 text-center sm:text-left min-w-0">
            <p className="text-sm font-bold text-[#24304A]">Love this adventure?</p>
            <p className="text-xs text-gray-500">Personalized with your child's name, photo & age. From $14.99.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a href="/themes" className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white font-semibold text-sm transition-colors">
              ← Browse
            </a>
            <a
              href={templateSlug ? `/register?template=${templateSlug}` : "/register"}
              className="px-5 py-2 rounded-xl text-white font-bold text-sm transition-colors"
              style={{ background: "#6C63FF" }}
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
      <div style={baseStyle}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
          <p className="flex-1 text-sm text-gray-500 text-center sm:text-left">
            Happy with the story? Approve to generate your PDF download.
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onRequestChanges}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold text-sm transition-colors"
            >
              ✏️ Request Changes
            </button>
            <button
              onClick={onApprove}
              disabled={approving}
              className="px-5 py-2 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50"
              style={{ background: "#6C63FF" }}
            >
              {approving ? "⏳ Generating…" : "✅ Approve Book"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // final
  return (
    <div style={baseStyle}>
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
        <p className="flex-1 text-sm text-gray-500 text-center sm:text-left">🎉 Your book is ready!</p>
        <div className="flex gap-2 flex-wrap justify-center flex-shrink-0">
          <button
            onClick={onReadAgain}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white font-semibold text-sm transition-colors"
          >
            📖 Read Again
          </button>
          {onShare && (
            <button
              onClick={onShare}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white font-semibold text-sm transition-colors"
            >
              📤 Share
            </button>
          )}
          <button
            onClick={onDownload}
            className="px-5 py-2 rounded-xl text-white font-bold text-sm transition-colors"
            style={{ background: "#06D6A0" }}
          >
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
