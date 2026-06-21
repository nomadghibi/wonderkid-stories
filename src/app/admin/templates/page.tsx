import { createServiceClient } from "@/lib/supabase/server";
import AdminToggleTemplate from "./ToggleTemplate";

export default async function AdminTemplatesPage() {
  const supabase = await createServiceClient();

  const { data: templates } = await supabase
    .from("book_templates")
    .select("id, slug, title, subtitle, category, age_min, age_max, page_count, price_cents, illustration_style, is_active, created_at, template_pages(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Product catalog — each template is a purchasable storybook.</p>
        </div>
        <span className="text-sm text-gray-400">{templates?.length ?? 0} templates</span>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 font-semibold">
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Slug</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Category</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Ages</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Pages</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(templates ?? []).map((t) => {
              const pageCount = (t.template_pages as unknown as { count: number }[])?.[0]?.count ?? t.page_count;
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{t.title}</div>
                    {t.subtitle && <div className="text-xs text-gray-400">{t.subtitle}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden md:table-cell">{t.slug}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell capitalize">{t.category ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{t.age_min}–{t.age_max}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{pageCount}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">${((t.price_cents ?? 0) / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {t.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AdminToggleTemplate id={t.id} isActive={t.is_active} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!templates || templates.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p>No templates yet</p>
            <p className="text-xs mt-1">Run migrations 006–007 in Supabase</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Templates seeded via <code>supabase/migrations/007_template_seed.sql</code>.
        Toggle active/inactive to show or hide from the catalog.
      </p>
    </div>
  );
}
