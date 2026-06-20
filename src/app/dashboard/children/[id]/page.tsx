import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChildPhotoUpload from "@/components/dashboard/ChildPhotoUpload";
import DeleteChildButton from "@/components/dashboard/DeleteChildButton";

type Params = { params: Promise<{ id: string }> };

export default async function ChildDetailPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: child } = await supabase
    .from("child_profiles")
    .select("*, child_photos(id, file_url, storage_path, is_primary, created_at)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!child) notFound();

  const { data: books } = await supabase
    .from("books")
    .select("id, title, status, created_at, story_themes(title)")
    .eq("child_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const photos = (child.child_photos ?? []) as {
    id: string; file_url: string; storage_path: string; is_primary: boolean; created_at: string;
  }[];
  const primaryPhoto = photos.find((p) => p.is_primary) ?? photos[0];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/children" className="text-sm text-[#6C63FF] hover:opacity-80">← Children</Link>
          <h1 className="text-2xl font-extrabold text-[#24304A] mt-1">{child.name}</h1>
          <p className="text-gray-500 text-sm">Age {child.age ?? "—"} · {child.reading_level?.replace("_", " ") ?? "early reader"}</p>
        </div>
        <Link
          href={`/dashboard/books/new?child=${child.id}`}
          className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          ✨ Create Book
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Photo section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-[#24304A] mb-4">Photo</h2>
          {primaryPhoto ? (
            <div className="mb-4">
              <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center text-4xl mb-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/children/${child.id}/photo-proxy`} alt={child.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <p className="text-xs text-gray-400">Photo uploaded ✓</p>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-purple-50 border-2 border-dashed border-purple-200 flex items-center justify-center text-3xl mb-4">👦</div>
          )}
          <ChildPhotoUpload childId={child.id} hasPhoto={!!primaryPhoto} />
        </div>

        {/* Profile details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#24304A]">Profile Details</h2>
            <Link href={`/dashboard/children/${child.id}/edit`} className="text-xs text-[#6C63FF] hover:opacity-80 font-medium">Edit →</Link>
          </div>
          <dl className="space-y-2 text-sm">
            {[
              ["Age", child.age],
              ["Gender", child.gender],
              ["Skin tone", child.skin_tone],
              ["Hair", child.hair_note],
              ["Favorite color", child.favorite_color],
              ["Favorite animal", child.favorite_animal],
              ["Favorite sport", child.favorite_sport],
              ["Reading level", child.reading_level?.replace("_", " ")],
            ].map(([label, val]) => val ? (
              <div key={String(label)} className="flex justify-between">
                <dt className="text-gray-400">{label}</dt>
                <dd className="font-medium text-[#24304A] capitalize">{String(val)}</dd>
              </div>
            ) : null)}
          </dl>
          {child.notes && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{child.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Books */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-bold text-[#24304A] mb-4">Books for {child.name}</h2>
        {!books || books.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No books yet.{" "}
            <Link href={`/dashboard/books/new`} className="text-[#6C63FF] hover:opacity-80">Create one →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {books.map((book) => {
              const theme = (Array.isArray(book.story_themes) ? book.story_themes[0] : book.story_themes) as { title: string } | null;
              return (
                <Link
                  key={book.id}
                  href={`/dashboard/books/${book.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#24304A] text-sm">{book.title ?? "Untitled"}</p>
                    <p className="text-xs text-gray-400">{theme?.title}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${book.status === "completed" ? "bg-green-100 text-green-700" : book.status === "reader_ready" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {book.status.replace(/_/g, " ")}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-6">
        <h2 className="font-bold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">Deleting a child profile removes all associated photos. Books are kept.</p>
        <DeleteChildButton childId={child.id} childName={child.name} />
      </div>
    </div>
  );
}
