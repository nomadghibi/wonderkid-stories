import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import BookReader from "@/components/reader/BookReader";

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

  return (
    <BookReader
      book={book}
      pages={pages ?? []}
      canApprove={book.status === "reader_ready" || book.status === "review_pending"}
      isCompleted={book.status === "completed"}
    />
  );
}
