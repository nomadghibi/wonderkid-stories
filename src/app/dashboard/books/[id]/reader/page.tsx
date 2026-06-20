import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import RealBookReader from "@/components/reader/RealBookReader";
import type { BookReaderData, BookReaderPage } from "@/types/reader";

type Params = { params: Promise<{ id: string }> };

export default async function ReaderPage({ params }: Params) {
  const { id: bookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: book }, { data: pages }] = await Promise.all([
    supabase
      .from("books")
      .select("*, story_themes(title, slug), child_profiles(name, age)")
      .eq("id", bookId)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("book_pages")
      .select("*")
      .eq("book_id", bookId)
      .order("page_number"),
  ]);

  if (!book) notFound();

  const readableStatuses = ["reader_ready", "review_pending", "approved", "completed"];
  if (!readableStatuses.includes(book.status)) {
    redirect(`/dashboard/books/${bookId}`);
  }

  const isCompleted = book.status === "completed" || book.status === "approved";
  const mode = isCompleted ? "final" : "review";

  const readerPages: BookReaderPage[] = (pages ?? []).map(p => ({
    pageId: p.id,
    pageNumber: p.page_number,
    pageType: p.page_type as BookReaderPage["pageType"],
    title: p.title ?? undefined,
    text: p.text_content ?? undefined,
    imageUrl: p.image_url ?? undefined,
  }));

  const coverPage = readerPages.find(p => p.pageType === "cover");

  const readerData: BookReaderData = {
    id: bookId,
    title: book.title ?? "My Storybook",
    childName: (book.child_profiles as { name: string } | null)?.name,
    coverImageUrl: coverPage?.imageUrl,
    mode,
    pages: readerPages,
  };

  return (
    <RealBookReader
      data={readerData}
      bookId={bookId}
      backHref="/dashboard/books"
      backLabel="My Books"
    />
  );
}
