"use client";

import Image from "next/image";

interface BookCoverProps {
  title: string;
  childName?: string;
  coverImageUrl?: string;
  onOpen: () => void;
}

export default function BookCover({ title, childName, coverImageUrl, onOpen }: BookCoverProps) {
  const placeholder = `https://placehold.co/480x640/6C63FF/FFFFFF?text=${encodeURIComponent(title)}`;
  const src = coverImageUrl || placeholder;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF8ED] via-purple-50 to-[#FFF8ED] p-8 gap-8">
      {/* Brand */}
      <div className="flex items-center gap-2 text-[#6C63FF]">
        <span className="text-2xl">📖</span>
        <span className="font-extrabold text-lg">WonderKid Stories</span>
      </div>

      {/* Book */}
      <div
        className="relative cursor-pointer group"
        onClick={onOpen}
        style={{
          filter: "drop-shadow(0 24px 40px rgba(108,99,255,0.35))",
          transform: "perspective(1200px) rotateY(-8deg)",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform =
            "perspective(1200px) rotateY(-4deg) translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform =
            "perspective(1200px) rotateY(-8deg)";
        }}
      >
        {/* Spine */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-l-sm"
          style={{
            width: 20,
            background: "linear-gradient(to right, #4A42D0, #5A52E0)",
            transform: "translateX(-18px) skewY(-0.5deg)",
            transformOrigin: "top right",
            boxShadow: "inset -2px 0 6px rgba(0,0,0,0.3)",
          }}
        />

        {/* Cover face */}
        <div
          className="relative overflow-hidden rounded-r-lg"
          style={{
            width: "min(280px, 68vw)",
            height: "min(380px, 88vw)",
            maxWidth: 320,
            maxHeight: 430,
            boxShadow: "inset -3px 0 8px rgba(0,0,0,0.15)",
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
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Title on cover */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h1 className="font-extrabold text-white text-xl leading-tight drop-shadow-lg">
              {title}
            </h1>
            {childName && (
              <p className="text-white/80 text-sm mt-1 font-medium">
                A story for {childName}
              </p>
            )}
          </div>

          {/* Sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm text-center max-w-xs">
        {childName ? `${childName}'s personalized adventure is ready to read!` : "Tap the cover to begin reading"}
      </p>

      {/* Open button */}
      <button
        onClick={onOpen}
        className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-extrabold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95 shadow-lg shadow-purple-200 flex items-center gap-2"
      >
        📖 Open Book
      </button>
    </div>
  );
}
