import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { LibraryBook, Subject } from "@/types/library";

const READING_LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  early_reader: "Early Reader",
  reader: "Reader",
};

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
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Beautiful ready-made storybooks. Open any book and start reading right now — no account needed.
          </p>
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

        {/* Book grid */}
        {books.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold">No books in this category yet.</p>
            <Link href="/library" className="text-[#6C63FF] text-sm font-bold hover:underline mt-2 inline-block">
              View all books →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              const subject = book.subjects as Subject | null;
              const coverBg = `#${book.cover_color}`;
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Cover */}
                  <div
                    className="relative overflow-hidden flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${coverBg}dd, ${coverBg}99)`,
                      aspectRatio: book.cover_image_url ? "3/4" : "5/3",
                    }}
                  >
                    {book.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-white px-4">
                        <div className="text-4xl mb-2">{subject?.emoji ?? "📖"}</div>
                        <p className="font-extrabold text-sm leading-tight">{book.title}</p>
                      </div>
                    )}
                    {/* Free badge */}
                    {book.is_free && (
                      <div className="absolute top-3 right-3 bg-[#06D6A0] text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                        FREE
                      </div>
                    )}
                    {/* Subject badge */}
                    {subject && (
                      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {subject.emoji} {subject.name}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-extrabold text-[#24304A] text-base mb-1 leading-snug">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="text-xs text-[#6C63FF] font-semibold mb-2">{book.subtitle}</p>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">
                      {book.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>Ages {book.age_min}–{book.age_max}</span>
                      <span>{READING_LEVEL_LABEL[book.reading_level] ?? book.reading_level}</span>
                      <span>{book.page_count} pages</span>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/library/${book.slug}`}
                      className="block text-center bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      📖 Read Now — Free
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
