import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import RealBookReader from "@/components/reader/RealBookReader";
import type { BookReaderData, BookReaderPage } from "@/types/reader";
import type { LibraryBookWithPages } from "@/types/library";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("library_books")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!data) return {};
  return {
    title: `${data.title} — WonderKid Library`,
    description: data.description ?? undefined,
  };
}

export default async function LibraryBookReaderPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  const { data: book } = await supabase
    .from("library_books")
    .select("*, library_book_pages(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single() as { data: LibraryBookWithPages | null };

  if (!book) notFound();

  const sortedPages = (book.library_book_pages ?? []).sort(
    (a, b) => a.page_number - b.page_number
  );

  const readerPages: BookReaderPage[] = sortedPages.map((p) => ({
    pageNumber: p.page_number,
    pageType: p.page_type as BookReaderPage["pageType"],
    title: p.title ?? undefined,
    text: p.text_content ?? undefined,
    imageUrl: p.image_url ?? undefined,
    layoutType: p.layout_type,
  }));

  const coverPage = readerPages.find((p) => p.pageType === "cover");

  const readerData: BookReaderData = {
    id: book.id,
    title: book.title,
    coverImageUrl: coverPage?.imageUrl,
    mode: "library",
    pages: readerPages,
  };

  return (
    <RealBookReader
      data={readerData}
      backHref="/library"
      backLabel="Library"
    />
  );
}
