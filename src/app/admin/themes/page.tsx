import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminThemesPage() {
  const supabase = await createServiceClient();
  const { data: themes } = await supabase
    .from("story_themes")
    .select("*, story_templates(id, title, version, is_active)")
    .order("created_at");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Story Themes</h1>
        <Link href="/admin/themes/new" className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          + Add Theme
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(themes ?? []).map((theme) => {
          const templates = Array.isArray(theme.story_templates) ? theme.story_templates : [];
          return (
            <div key={theme.id} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{theme.title}</h3>
                  <code className="text-xs text-gray-400 font-mono">{theme.slug}</code>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${theme.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {theme.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{theme.description}</p>
              <div className="text-xs text-gray-400 space-y-1 mb-4">
                <div>Ages {theme.age_min}–{theme.age_max} · {theme.page_count} pages</div>
                <div>{templates.length} template{templates.length !== 1 ? "s" : ""}</div>
              </div>
              <Link href={`/admin/themes/${theme.id}`} className="text-[#6C63FF] hover:opacity-80 text-sm font-medium">
                Edit theme →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
