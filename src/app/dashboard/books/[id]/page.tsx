import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type Params = { params: Promise<{ id: string }> };

const STATUS_INFO: Record<string, { label: string; color: string; desc: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600", desc: "Book created but not yet generated." },
  payment_pending: { label: "Awaiting Payment", color: "bg-yellow-100 text-yellow-700", desc: "Complete payment to start generation." },
  queued: { label: "Queued", color: "bg-blue-100 text-blue-600", desc: "Waiting in the generation queue." },
  story_generating: { label: "Writing Story...", color: "bg-purple-100 text-purple-700", desc: "AI is writing your child's personalized story." },
  images_generating: { label: "Creating Illustrations...", color: "bg-purple-100 text-purple-700", desc: "AI is generating beautiful illustrations." },
  reader_ready: { label: "Ready to Review!", color: "bg-green-100 text-green-700", desc: "Your book is ready. Open the reader to review and approve." },
  review_pending: { label: "Under Review", color: "bg-yellow-100 text-yellow-700", desc: "Feedback submitted. We're working on updates." },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", desc: "Book approved. PDF is being generated." },
  pdf_generating: { label: "Building PDF...", color: "bg-blue-100 text-blue-600", desc: "Generating your final downloadable PDF." },
  completed: { label: "Complete!", color: "bg-green-100 text-green-700", desc: "Your book is ready to download." },
  failed: { label: "Generation Failed", color: "bg-red-100 text-red-700", desc: "Something went wrong. Contact support or retry." },
};

export default async function BookDetailPage({ params }: Params) {
  const { id: bookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: book }, { data: pages }] = await Promise.all([
    supabase
      .from("books")
      .select("*, story_themes(*), child_profiles(*, child_photos(*))")
      .eq("id", bookId)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("book_pages")
      .select("id, page_number, page_type, title, status")
      .eq("book_id", bookId)
      .order("page_number"),
  ]);

  if (!book) notFound();

  const statusInfo = STATUS_INFO[book.status] ?? { label: book.status, color: "bg-gray-100 text-gray-600", desc: "" };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/books" className="text-sm text-[#6C63FF] hover:opacity-80">← My Books</Link>
          <h1 className="text-2xl font-extrabold text-[#24304A] mt-1">{book.title ?? "Untitled Book"}</h1>
        </div>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>

      {/* Status card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">
            {book.status === "completed" ? "🎉" : book.status === "failed" ? "⚠️" : book.status.includes("generating") ? "⚙️" : "📖"}
          </div>
          <div>
            <h2 className="font-bold text-[#24304A]">{statusInfo.label}</h2>
            <p className="text-sm text-gray-500">{statusInfo.desc}</p>
          </div>
        </div>

        {/* Progress bar for generating states */}
        {["queued", "story_generating", "images_generating", "pdf_generating"].includes(book.status) && (
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
            <div
              className="bg-[#6C63FF] h-2 rounded-full transition-all duration-500"
              style={{
                width: book.status === "queued" ? "10%" : book.status === "story_generating" ? "35%" : book.status === "images_generating" ? "65%" : "90%",
              }}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {(book.status === "reader_ready" || book.status === "review_pending" || book.status === "approved" || book.status === "completed") && (
            <Link
              href={`/dashboard/books/${bookId}/reader`}
              className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              📖 Open Reader
            </Link>
          )}
          {book.status === "completed" && (
            <a
              href={`/api/books/${bookId}/download`}
              className="bg-[#06D6A0] hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              📥 Download PDF
            </a>
          )}
          {book.status === "draft" && (
            <Link
              href={`/dashboard/books/new`}
              className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Create Another
            </Link>
          )}
        </div>
      </div>

      {/* Book details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-[#24304A] mb-3">Book Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Theme</dt>
              <dd className="font-medium text-[#24304A]">{(book.story_themes as { title: string } | null)?.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Child</dt>
              <dd className="font-medium text-[#24304A]">{(book.child_profiles as { name: string } | null)?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Pages</dt>
              <dd className="font-medium text-[#24304A]">{pages?.length ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium text-[#24304A]">{new Date(book.created_at).toLocaleDateString()}</dd>
            </div>
            {book.approved_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Approved</dt>
                <dd className="font-medium text-[#24304A]">{new Date(book.approved_at).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Pages list */}
        {pages && pages.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-[#24304A] mb-3">Pages</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {pages.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {p.page_type === "cover" ? "📖 Cover" : p.page_type === "dedication" ? "💌 Dedication" : `Page ${p.page_number}`}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "ready" ? "bg-green-100 text-green-700" : p.status === "failed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
