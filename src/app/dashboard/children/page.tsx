import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ChildrenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: children } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Child Profiles</h1>
          <p className="text-gray-500 mt-1">Manage your children&apos;s profiles and photos</p>
        </div>
        <Link
          href="/dashboard/children/new"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + Add Child
        </Link>
      </div>

      {!children || children.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">👦</div>
          <h3 className="font-semibold text-gray-900 mb-1">No child profiles yet</h3>
          <p className="text-gray-500 text-sm mb-6">Add your child&apos;s details to create personalized storybooks.</p>
          <Link
            href="/dashboard/children/new"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Add First Child
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/dashboard/children/${child.id}`}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  👦
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{child.name}</h3>
                  <p className="text-sm text-gray-500">Age {child.age}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                {child.favorite_animal && <span>🐾 {child.favorite_animal}</span>}
                {child.favorite_sport && <span>⚽ {child.favorite_sport}</span>}
                {child.favorite_color && <span>🎨 {child.favorite_color}</span>}
                {child.reading_level && <span>📖 {child.reading_level}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
