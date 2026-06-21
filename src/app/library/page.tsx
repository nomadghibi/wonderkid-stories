import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { LibraryBook, Subject } from "@/types/library";
import LibraryGrid from "@/components/library/LibraryGrid";
import StreakBadge from "@/components/library/StreakBadge";
import GoalWidget from "@/components/library/GoalWidget";


export const metadata = {
  title: "Book Library — WonderKid Stories",
  description: "Free interactive children's books. Open, read, and enjoy instantly — no account needed.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject: subjectFilter } = await searchParams;
  const supabase = await createServiceClient();

  const [{ data: subjects }, { data: allBooks }] = await Promise.all([
    supabase.from("subjects").select("*").eq("is_active", true).order("sort_order"),
    supabase
      .from("library_books")
      .select("*, subjects(id, name, slug, emoji)")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const books = ((allBooks ?? []) as LibraryBook[]).filter((b) => {
    if (!subjectFilter || subjectFilter === "all") return true;
    return (b.subjects as Subject | null)?.slug === subjectFilter;
  });

  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-[#FFD166]/30">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
        <div className="flex gap-3 items-center">
          <Link href="/library/parent" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium">
            👨‍👩‍👧 Parents
          </Link>
          <Link href="/library/stats" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium">
            📊 Stats
          </Link>
          <Link href="/themes" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium">
            Custom Books
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

      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#6C63FF]/10 text-[#6C63FF] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            <span>📚</span> Free Interactive Books
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#24304A] mb-4 leading-tight">
            The WonderKid Library
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto mb-5">
            Beautiful ready-made storybooks. Open any book and start reading right now — no account needed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <StreakBadge />
            <GoalWidget />
          </div>
        </div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <Link
            href="/library"
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              !subjectFilter || subjectFilter === "all"
                ? "bg-[#6C63FF] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#6C63FF] hover:text-[#6C63FF]"
            }`}
          >
            All Books
          </Link>
          {((subjects ?? []) as Subject[]).map((s) => (
            <Link
              key={s.slug}
              href={`/library?subject=${s.slug}`}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${
                subjectFilter === s.slug
                  ? "bg-[#6C63FF] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#6C63FF] hover:text-[#6C63FF]"
              }`}
            >
              <span>{s.emoji}</span>
              {s.name}
            </Link>
          ))}
        </div>

        {/* Book grid — client component so it can read localStorage progress */}
        <LibraryGrid books={books} />

        {/* Upsell strip */}
        <div className="mt-16 bg-[#6C63FF] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Want a book with YOUR child's name?</h2>
          <p className="text-purple-200 text-sm mb-6 max-w-md mx-auto">
            Create a fully personalized storybook with your child's name, age, favorite color, and photo. From $14.99.
          </p>
          <Link
            href="/themes"
            className="inline-block bg-white text-[#6C63FF] font-extrabold px-8 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm"
          >
            ✨ Create a Custom Book →
          </Link>
        </div>
      </section>
    </main>
  );
}
