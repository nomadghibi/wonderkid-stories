import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { BookTemplate } from "@/types/template";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Map template slug → local illustrated page images from public/library/
const TEMPLATE_IMAGES: Record<string, { cover: string; pages: string[] }> = {
  "baseball-hero": {
    cover: "/library/baseball-dream/cover.png",
    pages: [
      "/library/baseball-dream/page-03.png",
      "/library/baseball-dream/page-06.png",
      "/library/baseball-dream/page-09.png",
    ],
  },
  "magical-forest": {
    cover: "/library/magical-forest-path/cover.png",
    pages: [
      "/library/magical-forest-path/page-02.png",
      "/library/magical-forest-path/page-05.png",
      "/library/magical-forest-path/page-08.png",
    ],
  },
  "space-explorer": {
    cover: "/library/little-space-explorer/cover.png",
    pages: [
      "/library/little-space-explorer/page-01.png",
      "/library/little-space-explorer/page-04.png",
      "/library/little-space-explorer/page-07.png",
    ],
  },
};

const SLUG_EMOJI: Record<string, string> = {
  "baseball-hero":       "⚾",
  "magical-forest":      "🌲",
  "space-explorer":      "🚀",
  "underwater-explorer": "🐠",
  "superhero-academy":   "🦸",
  "dinosaur-discovery":  "🦕",
};

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  Sports:    { bg: "#DCFCE7", color: "#166534" },
  Fantasy:   { bg: "#EDE9FE", color: "#5B21B6" },
  Adventure: { bg: "#DBEAFE", color: "#1E40AF" },
  Science:   { bg: "#FEF9C3", color: "#854D0E" },
  Animals:   { bg: "#FFE4E6", color: "#9F1239" },
};

const CARD_GRADIENT: Record<string, string> = {
  Sports:    "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)",
  Fantasy:   "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)",
  Adventure: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
  Science:   "linear-gradient(135deg, #fef9c3 0%, #fde047 100%)",
  Animals:   "linear-gradient(135deg, #ffe4e6 0%, #fda4af 100%)",
  default:   "linear-gradient(135deg, #ede9fe 0%, #a5b4fc 100%)",
};

const STEPS = [
  { n: "1", icon: "🎭", title: "Pick an adventure",  desc: "Choose the theme that fits your child's personality." },
  { n: "2", icon: "👧", title: "Add your child",     desc: "Name, age, photo, favorites — takes 2 minutes." },
  { n: "3", icon: "✨", title: "AI builds the book", desc: "Custom story and illustrations created just for them." },
  { n: "4", icon: "📥", title: "Read & download",    desc: "Read online instantly, approve, then download your PDF." },
];

export default async function ThemesPage() {
  const supabase = await createServiceClient();
  const { data: templates } = await supabase
    .from("book_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const catalog = (templates ?? []) as BookTemplate[];

  // Build hero cover list from local images (always available)
  const heroCoverSlugs = ["baseball-hero", "magical-forest", "space-explorer"] as const;
  const heroImages = heroCoverSlugs.map(slug => ({
    slug,
    src: TEMPLATE_IMAGES[slug]?.cover,
    label: catalog.find(t => t.slug === slug)?.title ?? slug,
  })).filter(h => h.src);

  return (
    <main className="min-h-screen bg-[#FFF8ED] overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-[#FFD166]/30">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
        <div className="flex gap-3 items-center">
          <Link href="/library" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium hidden sm:block">
            📚 Free Books
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FFD166]/30 text-[#856015] text-sm font-extrabold px-4 py-1.5 rounded-full mb-6">
            ⭐ Loved by 500+ families
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#24304A] leading-[1.08] mb-6">
            Your child.<br />
            Their story.<br />
            <span className="text-[#6C63FF]">Their book.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
            A fully personalized illustrated storybook — your child&apos;s name, photo, and adventure. Created by AI in minutes. Loved forever.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="#templates"
              className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-extrabold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-purple-200/60 active:scale-95"
            >
              Choose an Adventure ↓
            </Link>
            <Link
              href="/library"
              className="border-2 border-gray-200 hover:border-[#6C63FF] text-gray-600 hover:text-[#6C63FF] font-bold px-6 py-4 rounded-2xl text-base transition-colors"
            >
              📚 Read Free Books
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400 font-medium">
            <span>⭐⭐⭐⭐⭐ 4.9 / 5</span>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <span>📥 Download in minutes</span>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <span>✅ 100% satisfaction</span>
          </div>
        </div>

        {/* Right: real cover collage */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-96 h-96">
            {heroImages.map((h, i) => {
              const transforms = [
                "rotate(-6deg) translateX(-40px) translateY(20px)",
                "rotate(4deg) translateX(35px) translateY(-10px)",
                "rotate(-1deg) translateX(-8px) translateY(-30px)",
              ];
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={h.slug}
                  src={h.src!}
                  alt={h.label}
                  className="absolute rounded-2xl shadow-2xl object-cover"
                  style={{
                    width: 180,
                    height: 240,
                    left: "50%",
                    top: "50%",
                    marginLeft: -90,
                    marginTop: -120,
                    transform: transforms[i],
                    zIndex: i + 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Template grid ────────────────────────────────────────────────── */}
      <section id="templates" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#24304A] mb-2">
            Choose your adventure
          </h2>
          <p className="text-gray-500">Preview any book free — no account needed</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((template) => {
            const emoji  = SLUG_EMOJI[template.slug] ?? "📖";
            const badge  = CATEGORY_BADGE[template.category ?? ""] ?? { bg: "#EDE9FE", color: "#5B21B6" };
            const imgs   = TEMPLATE_IMAGES[template.slug];
            const bgSrc  = imgs?.cover ?? template.sample_cover_url;
            const hasImg = !!bgSrc;

            return (
              <div
                key={template.id}
                className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
                style={{ minHeight: 460 }}
              >
                {/* ── Background ─────────────────────────────────────── */}
                {hasImg ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bgSrc!}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dual gradient: subtle dark top + strong dark bottom */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0.92) 100%)",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: CARD_GRADIENT[template.category ?? ""] ?? CARD_GRADIENT.default }}
                  >
                    <span className="text-[120px] leading-none drop-shadow-md opacity-80">{emoji}</span>
                  </div>
                )}

                {/* ── Top badges ─────────────────────────────────────── */}
                <div className="relative z-10 flex items-start justify-between p-4">
                  <span
                    className="text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm"
                    style={{
                      background: hasImg ? "rgba(255,255,255,0.92)" : badge.bg,
                      color: badge.color,
                    }}
                  >
                    {template.category ?? "Adventure"}
                  </span>
                  <span
                    className="text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      color: "#6C63FF",
                    }}
                  >
                    {formatPrice(template.price_cents)}
                  </span>
                </div>

                {/* ── Page thumbnails (hover reveal) ─────────────────── */}
                {imgs?.pages && (
                  <div className="absolute bottom-36 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {imgs.pages.slice(0, 3).map((p, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={p}
                        alt=""
                        className="w-12 h-16 object-cover rounded-lg shadow-lg border-2 border-white/60"
                      />
                    ))}
                  </div>
                )}

                {/* ── Bottom content ─────────────────────────────────── */}
                <div className="relative z-10 mt-auto p-5 pb-5">
                  <h3
                    className="font-extrabold text-[18px] leading-snug mb-1"
                    style={{ color: hasImg ? "white" : "#24304A" }}
                  >
                    {template.title}
                  </h3>
                  {template.subtitle && (
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: hasImg ? "rgba(255,255,255,0.75)" : "#6C63FF" }}
                    >
                      {template.subtitle}
                    </p>
                  )}
                  <p
                    className="text-sm leading-relaxed line-clamp-2 mb-3"
                    style={{ color: hasImg ? "rgba(255,255,255,0.7)" : "#6b7280" }}
                  >
                    {template.description}
                  </p>
                  <div
                    className="flex items-center gap-2 text-xs mb-4"
                    style={{ color: hasImg ? "rgba(255,255,255,0.5)" : "#9ca3af" }}
                  >
                    <span>Ages {template.age_min}–{template.age_max}</span>
                    <span>·</span>
                    <span>{template.page_count} illustrated pages</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/themes/${template.slug}/preview`}
                      className="flex-1 text-center font-bold py-2.5 rounded-xl text-sm transition-colors"
                      style={hasImg
                        ? { background: "rgba(255,255,255,0.18)", color: "white", border: "1.5px solid rgba(255,255,255,0.5)" }
                        : { border: "2px solid rgba(108,99,255,0.3)", color: "#6C63FF" }
                      }
                    >
                      Preview free
                    </Link>
                    <Link
                      href={`/register?template=${template.slug}`}
                      className="flex-1 text-center font-bold py-2.5 rounded-xl text-sm transition-colors"
                      style={hasImg
                        ? { background: "white", color: "#6C63FF" }
                        : { background: "#6C63FF", color: "white" }
                      }
                    >
                      Create book →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Coming soon */}
          <div className="rounded-3xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 460 }}>
            <div className="text-5xl mb-3">🎨</div>
            <h3 className="font-extrabold text-gray-400 mb-1">More coming soon</h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">Princess, Dinosaur, Birthday and more adventures on the way</p>
            <Link href="/register" className="text-sm font-bold text-[#6C63FF] hover:opacity-75 transition-opacity">
              Get notified →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#24304A] text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.n} className="text-center relative">
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-5 left-1/2 w-full h-0 border-t-2 border-dashed border-[#6C63FF]/20 pointer-events-none"
                    style={{ marginLeft: "20px" }}
                  />
                )}
                <div className="w-10 h-10 bg-[#6C63FF] text-white font-extrabold text-sm rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-md shadow-purple-200/50">
                  {s.n}
                </div>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-extrabold text-[#24304A] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Illustrated strip ────────────────────────────────────────────── */}
      <section className="py-16 overflow-hidden">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Sample pages from our books</p>
        <div className="flex gap-3 px-6" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            "/library/baseball-dream/page-04.png",
            "/library/magical-forest-path/page-03.png",
            "/library/little-space-explorer/page-05.png",
            "/library/baseball-dream/page-07.png",
            "/library/magical-forest-path/page-06.png",
            "/library/little-space-explorer/page-02.png",
            "/library/baseball-dream/page-10.png",
            "/library/magical-forest-path/page-09.png",
          ].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="rounded-xl shadow-md object-cover flex-shrink-0"
              style={{ width: 200, height: 150 }}
            />
          ))}
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: "🎨", title: "Real illustrations",  desc: "Every page has a unique AI-generated illustration tailored to your child." },
            { icon: "⚡", title: "Ready in minutes",    desc: "From order to finished book in under 5 minutes. Preview before you pay." },
            { icon: "💜", title: "Loved by families",   desc: "Over 500 personalized books created. 4.9 ★ average rating from parents." },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-extrabold text-[#24304A] mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div
          className="rounded-3xl p-12 text-center text-white"
          style={{ background: "linear-gradient(135deg, #6C63FF 0%, #5A52E0 100%)" }}
        >
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-3xl font-extrabold mb-3">Create their story today</h2>
          <p className="text-purple-200 mb-8 max-w-sm mx-auto leading-relaxed">
            Preview any book for free. Personalized versions from {formatPrice(1499)}.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#6C63FF] font-extrabold px-10 py-4 rounded-2xl hover:bg-purple-50 transition-colors shadow-xl text-base"
          >
            Get Started Free →
          </Link>
          <p className="text-purple-300/70 text-xs mt-4">No account needed to preview</p>
        </div>
      </section>
    </main>
  );
}
