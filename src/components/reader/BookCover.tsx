"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BookCoverProps {
  title: string;
  childName?: string;
  coverImageUrl?: string;
  isImageOnly?: boolean;
  onOpen: () => void;
  backHref?: string;
  backLabel?: string;
}

export default function BookCover({
  title,
  childName,
  coverImageUrl,
  isImageOnly,
  onOpen,
  backHref,
  backLabel,
}: BookCoverProps) {
  const [hovered, setHovered] = useState(false);
  const placeholder = `https://placehold.co/600x800/6C63FF/FFFFFF?text=${encodeURIComponent(title)}`;
  const src = coverImageUrl || placeholder;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-br from-[#FFF8ED] via-[#f5f0ff] to-[#FFF8ED] overflow-hidden">
      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 backdrop-blur-sm border-b border-white/40">
        {backHref ? (
          <Link href={backHref} className="text-sm text-[#6C63FF] font-semibold hover:opacity-75 transition-opacity">
            ← {backLabel ?? "Back"}
          </Link>
        ) : <div />}
        <div className="flex items-center gap-1.5 text-[#6C63FF]">
          <span className="text-lg">📖</span>
          <span className="font-extrabold text-sm hidden sm:inline">WonderKid Stories</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-6">
        {/* Subtitle */}
        {!isImageOnly && (
          <p className="text-[#6C63FF] font-bold text-sm tracking-wide uppercase opacity-70">
            {childName ? `A Story for ${childName}` : "Your Personalized Storybook"}
          </p>
        )}

        {/* 3D Book */}
        <div
          className="relative cursor-pointer"
          onClick={onOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            perspective: "1200px",
            transition: "transform 0.05s",
          }}
        >
          <div
            style={{
              transform: hovered
                ? "rotateY(-5deg) translateY(-6px)"
                : "rotateY(-12deg)",
              transformStyle: "preserve-3d",
              transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)",
              filter: hovered
                ? "drop-shadow(0 32px 48px rgba(108,99,255,0.5))"
                : "drop-shadow(0 20px 32px rgba(108,99,255,0.35))",
            }}
          >
            {/* Spine */}
            <div
              style={{
                position: "absolute",
                left: -22,
                top: 0,
                bottom: 0,
                width: 22,
                background: "linear-gradient(to right, #3D35C0, #5A52E0, #4A42D0)",
                borderRadius: "4px 0 0 4px",
                boxShadow: "inset -3px 0 8px rgba(0,0,0,0.35)",
                transformOrigin: "right center",
                transform: "rotateY(90deg) translateZ(-11px)",
              }}
            />

            {/* Cover face */}
            <div
              className="relative overflow-hidden"
              style={{
                width: "min(260px, 62vw)",
                height: "min(360px, 84vw)",
                maxWidth: 300,
                maxHeight: 420,
                borderRadius: "0 8px 8px 0",
                boxShadow: "inset -4px 0 12px rgba(0,0,0,0.18), 4px 0 0 #3D35C0",
              }}
            >
              <Image
                src={src}
                alt={title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Gradient overlay + title — hidden for image-only books (title baked into cover art) */}
              {!isImageOnly && (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h1 className="font-extrabold text-white leading-tight drop-shadow-lg text-lg">
                      {title}
                    </h1>
                    {childName && (
                      <p className="text-white/80 text-xs mt-1 font-semibold">
                        A story for {childName}
                      </p>
                    )}
                  </div>
                </>
              )}
              {/* Sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 45%, rgba(0,0,0,0.06) 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Open button */}
        <button
          onClick={onOpen}
          className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-extrabold px-10 py-4 rounded-2xl text-lg transition-all active:scale-95 shadow-xl shadow-purple-200/60 flex items-center gap-2.5 mt-2"
        >
          <span className="text-xl">📖</span>
          Open Book
        </button>

        <p className="text-gray-400 text-xs text-center">
          Use ← → keys or swipe to turn pages
        </p>
      </div>
    </div>
  );
}
