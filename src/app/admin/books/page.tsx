import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminBooksPage() {
  const supabase = await createServiceClient();

  const { data: books } = await supabase
    .from("books")
    .select("id, title, status, review_status, created_at, story_themes(title), child_profiles(name), users(email)")
    .order("created_at", { ascending: false })
    .limit(100);

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    reader_ready: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
    story_generating: "bg-yellow-100 text-yellow-700",
    images_generating: "bg-yellow-100 text-yellow-700",
    queued: "bg-gray-100 text-gray-600",
    draft: "bg-gray-100 text-gray-500",
    approved: "bg-green-100 text-green-600",
    completed_pdf: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Books</h1>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 font-semibold">
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Customer</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Child</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Theme</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Created</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(books ?? []).map((book) => {
              const theme = (Array.isArray(book.story_themes) ? book.story_themes[0] : book.story_themes) as { title: string } | null | undefined;
              const child = (Array.isArray(book.child_profiles) ? book.child_profiles[0] : book.child_profiles) as { name: string } | null | undefined;
              const user = (Array.isArray(book.users) ? book.users[0] : book.users) as { email: string } | null | undefined;
              return (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[180px]">{book.title ?? "Untitled"}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell truncate max-w-[160px]">{user?.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{child?.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell truncate max-w-[140px]">{theme?.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[book.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {book.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{new Date(book.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/books/${book.id}`} className="text-[#6C63FF] hover:opacity-80 font-medium text-xs">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!books || books.length === 0) && (
          <div className="text-center py-12 text-gray-400">No books yet</div>
        )}
      </div>
    </div>
  );
}
