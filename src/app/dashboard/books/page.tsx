import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  payment_pending: { label: "Awaiting Payment", color: "bg-yellow-100 text-yellow-700" },
  queued: { label: "Queued", color: "bg-blue-100 text-blue-700" },
  story_generating: { label: "Writing Story...", color: "bg-blue-100 text-blue-700" },
  images_generating: { label: "Creating Art...", color: "bg-purple-100 text-purple-700" },
  reader_ready: { label: "Ready to Review", color: "bg-green-100 text-green-700" },
  review_pending: { label: "Under Review", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  pdf_generating: { label: "Building PDF...", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
};

export default async function BooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: books } = await supabase
    .from("books")
    .select("id, title, status, created_at, story_themes(title), child_profiles(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-500 mt-1">All your personalized storybooks</p>
        </div>
        <Link
          href="/dashboard/books/new"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          ✨ Create Book
        </Link>
      </div>

      {!books || books.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-semibold text-gray-900 mb-1">No books yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first personalized storybook adventure.</p>
          <Link
            href="/dashboard/books/new"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Create First Book
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Book</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Child</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Theme</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Created</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.map((book) => {
                const statusInfo = STATUS_LABELS[book.status] ?? { label: book.status, color: "bg-gray-100 text-gray-600" };
                const theme = Array.isArray(book.story_themes)
                  ? (book.story_themes[0] as { title: string } | undefined)
                  : (book.story_themes as { title: string } | null);
                const child = Array.isArray(book.child_profiles)
                  ? (book.child_profiles[0] as { name: string } | undefined)
                  : (book.child_profiles as { name: string } | null);

                return (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 text-sm">{book.title ?? "Untitled"}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{child?.name ?? "—"}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{theme?.title ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-400">
                      {new Date(book.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {book.status === "reader_ready" || book.status === "approved" || book.status === "completed" ? (
                          <Link href={`/dashboard/books/${book.id}/reader`} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                            Read
                          </Link>
                        ) : null}
                        {book.status === "completed" ? (
                          <Link href={`/api/books/${book.id}/download`} className="text-xs text-green-600 hover:text-green-700 font-medium">
                            Download
                          </Link>
                        ) : null}
                        <Link href={`/dashboard/books/${book.id}`} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
