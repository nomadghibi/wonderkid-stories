import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminTemplatesPage() {
  const supabase = await createServiceClient();
  const { data: templates } = await supabase
    .from("story_templates")
    .select("*, story_themes(title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Story Templates</h1>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 font-semibold">
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Theme</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Version</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Reading Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(templates ?? []).map((t) => {
              const theme = (Array.isArray(t.story_themes) ? t.story_themes[0] : t.story_themes) as { title: string; slug: string } | null;
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.title ?? "Untitled"}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{theme?.title ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">v{t.version}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {t.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{t.default_reading_level?.replace("_", " ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!templates || templates.length === 0) && <div className="text-center py-12 text-gray-400">No templates yet</div>}
      </div>
      <p className="text-xs text-gray-400">Templates are seeded via <code>supabase/migrations/003_seed.sql</code>. Edit prompts there and re-run the seed for now. Full UI editor coming in Phase 3.</p>
    </div>
  );
}
