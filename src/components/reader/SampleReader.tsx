"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReaderPage, ReaderBook } from "@/types/template";

interface SampleReaderProps {
  book: ReaderBook;
  pages: ReaderPage[];
}

const CATEGORY_EMOJI: Record<string, string> = {
  Sports: "⚾",
  Fantasy: "🌲",
  Adventure: "🚀",
  default: "📖",
};

function CertificatePage({ title, templateSlug }: { title: string; templateSlug?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] px-8 py-10 bg-gradient-to-br from-purple-50 to-yellow-50 text-center">
      <div className="text-5xl mb-4">🏅</div>
      <h2 className="text-2xl font-extrabold text-[#24304A] mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
        In the personalized version, this page becomes a printable certificate — with your child's real name!
      </p>
      <Link
        href={templateSlug ? `/dashboard/books/new?template=${templateSlug}` : "/register"}
        className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
      >
        ✨ Create Your Child's Version
      </Link>
    </div>
  );
}

export default function SampleReader({ book, pages }: SampleReaderProps) {
  const visiblePages = pages.filter((p) => p.pageType !== "dedication");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPage = visiblePages[currentIndex];
  const totalPages = visiblePages.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalPages - 1;

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">📖</div>
          <p>No pages in this preview.</p>
        </div>
      </div>
    );
  }

  const isCover = currentPage.pageType === "cover";
  const isCertificate = currentPage.pageType === "certificate";

  const PLACEHOLDER_COLORS = ["6C63FF", "FF6B6B", "06D6A0", "FFD166", "4ECDC4"];
  const placeholderColor = PLACEHOLDER_COLORS[currentIndex % PLACEHOLDER_COLORS.length];
  const placeholderUrl = `https://placehold.co/800x500/${placeholderColor}/FFFFFF?text=${encodeURIComponent(currentPage.title || "WonderKid Stories")}`;

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-[#FFF8ED]" : ""} flex flex-col min-h-[600px]`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
            SAMPLE PREVIEW
          </div>
          <div>
            <h1 className="font-extrabold text-[#24304A] text-base truncate max-w-xs">{book.title}</h1>
            {book.themeTitle && (
              <p className="text-xs text-gray-400">{book.themeTitle}</p>
            )}
          </div>
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
            <Link href="/themes" className="text-xs text-gray-500 hover:text-gray-700">
              ← Browse Templates
            </Link>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className={`flex-1 flex flex-col md:flex-row ${isFullscreen ? "overflow-hidden" : ""}`}>
        {/* Illustration (70%) */}
        <div
          className="md:w-[70%] bg-gray-50 flex items-center justify-center relative"
          style={{ minHeight: isFullscreen ? "60vh" : "300px" }}
        >
          {isCertificate ? (
            <CertificatePage title={currentPage.title} templateSlug={book.templateSlug} />
          ) : (
            <>
              {currentPage.imageUrl ? (
                <div className="relative w-full h-full" style={{ minHeight: isFullscreen ? "60vh" : "320px" }}>
                  <Image
                    src={currentPage.imageUrl}
                    alt={currentPage.title || `Page ${currentPage.pageNumber}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="relative w-full h-full" style={{ minHeight: isFullscreen ? "60vh" : "320px" }}>
                  <Image
                    src={placeholderUrl}
                    alt={currentPage.title || `Page ${currentPage.pageNumber}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {isCover && (
                <div className="absolute top-3 left-3 bg-[#6C63FF] text-white text-xs font-bold px-2 py-1 rounded-full">
                  Cover
                </div>
              )}

              {/* Sample watermark */}
              <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                Sample Preview
              </div>
            </>
          )}
        </div>

        {/* Text panel (30%) */}
        {!isCertificate && (
          <div className="md:w-[30%] bg-white flex flex-col p-6 md:p-8" style={{ minHeight: "200px" }}>
            {currentPage.title && (
              <h2 className="font-extrabold text-[#24304A] text-lg mb-3 leading-snug">
                {currentPage.title}
              </h2>
            )}
            <p
              className="text-[#24304A] leading-relaxed flex-1"
              style={{ fontSize: "20px", lineHeight: "1.65" }}
            >
              {currentPage.text}
            </p>
            {isCover && (
              <p className="text-xs text-gray-400 mt-4 italic">
                In your personalized book, this title will include your child's name.
              </p>
            )}
          </div>
        )}
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

          <div className="flex items-center gap-1.5">
            {visiblePages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all rounded-full ${
                  i === currentIndex
                    ? "w-3 h-3 bg-[#6C63FF]"
                    : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {currentIndex + 1} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentIndex((i) => Math.min(totalPages - 1, i + 1))}
            disabled={isLast}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* CTA bar */}
      <div className="bg-[#FFF8ED] border-t border-purple-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-[#24304A] text-sm">
              Want this book with your child's real name and photo?
            </p>
            <p className="text-xs text-gray-500">Takes about 2 minutes to set up. From $14.99.</p>
          </div>
          <Link
            href={book.templateSlug ? `/dashboard/books/new?template=${book.templateSlug}` : "/register"}
            className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            ✨ Create Your Version →
          </Link>
        </div>
      </div>
    </div>
  );
}
