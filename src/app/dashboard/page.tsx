import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "there";

  // Fetch stats
  const [{ count: bookCount }, { count: childCount }] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("child_profiles").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
  ]);

  // Fetch recent books
  const { data: recentBooks } = await supabase
    .from("books")
    .select("id, title, status, created_at, story_themes(title)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hey, {firstName}! 👋</h1>
        <p className="text-gray-500 mt-1">Your child&apos;s story adventures live here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Books", value: bookCount ?? 0, icon: "📚" },
          { label: "Child Profiles", value: childCount ?? 0, icon: "👦" },
          { label: "Downloads", value: 0, icon: "📥" },
          { label: "Books Shared", value: 0, icon: "🔗" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/books/new"
          className="group bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 text-white transition-colors"
        >
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-bold text-lg mb-1">Create a New Book</h3>
          <p className="text-purple-200 text-sm">Choose an adventure and let AI do the magic.</p>
        </Link>
        <Link
          href="/dashboard/children/new"
          className="group bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-6 transition-colors"
        >
          <div className="text-3xl mb-3">👦</div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">Add a Child Profile</h3>
          <p className="text-gray-500 text-sm">Upload a photo and personalization details.</p>
        </Link>
      </div>

      {/* Recent books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Books</h2>
          <Link href="/dashboard/books" className="text-sm text-purple-600 hover:text-purple-700">
            View all →
          </Link>
        </div>

        {!recentBooks || recentBooks.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">📖</div>
            <p className="text-gray-500 text-sm">No books yet. Create your first adventure!</p>
            <Link
              href="/dashboard/books/new"
              className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Create Book
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Record<string, unknown> }) {
  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    reader_ready: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
    queued: "bg-yellow-100 text-yellow-700",
    story_generating: "bg-yellow-100 text-yellow-700",
    images_generating: "bg-yellow-100 text-yellow-700",
    draft: "bg-gray-100 text-gray-600",
  };

  const status = book.status as string;
  const id = book.id as string;
  const title = (book.title as string) ?? "Untitled Book";
  const createdAt = book.created_at as string;
  const theme = book.story_themes as { title: string } | null;

  return (
    <Link
      href={`/dashboard/books/${id}`}
      className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex items-start gap-4"
    >
      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        📖
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{theme?.title ?? "Unknown theme"}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status.replace(/_/g, " ")}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
