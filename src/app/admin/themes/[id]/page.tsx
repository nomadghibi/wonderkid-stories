"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface ThemeForm {
  slug: string;
  title: string;
  description: string;
  category: string;
  age_min: number;
  age_max: number;
  page_count: number;
  is_active: boolean;
}

export default function EditThemePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<ThemeForm>({
    slug: "",
    title: "",
    description: "",
    category: "adventure",
    age_min: 3,
    age_max: 9,
    page_count: 10,
    is_active: true,
  });

  useEffect(() => {
    fetch(`/api/admin/themes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          slug: data.slug ?? "",
          title: data.title ?? "",
          description: data.description ?? "",
          category: data.category ?? "adventure",
          age_min: data.age_min ?? 3,
          age_max: data.age_max ?? 9,
          page_count: data.page_count ?? 10,
          is_active: data.is_active ?? true,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load theme");
        setLoading(false);
      });
  }, [id]);

  function set(field: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setSuccess(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/admin/themes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age_min: Number(form.age_min),
          age_max: Number(form.age_max),
          page_count: Number(form.page_count),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ? JSON.stringify(data.error) : `Error ${res.status}`);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Deactivate this theme? It will be hidden from users.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/themes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to deactivate");
      router.push("/admin/themes");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-gray-500 p-6">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/themes" className="text-sm text-[#6C63FF] hover:opacity-80">← Back to Themes</Link>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Edit Theme</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">Saved successfully.</div>}

      <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] resize-none"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
            >
              <option value="adventure">Adventure</option>
              <option value="fantasy">Fantasy</option>
              <option value="sports">Sports</option>
              <option value="science">Science</option>
              <option value="animals">Animals</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Min Age</label>
            <input
              type="number" min={1} max={18}
              value={form.age_min}
              onChange={(e) => set("age_min", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Age</label>
            <input
              type="number" min={1} max={18}
              value={form.age_max}
              onChange={(e) => set("age_max", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Page Count</label>
            <input
              type="number" min={5} max={30}
              value={form.page_count}
              onChange={(e) => set("page_count", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="w-4 h-4 text-[#6C63FF] rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">Active (visible to users)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/admin/themes" className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors">
              Cancel
            </Link>
          </div>
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={saving}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Deactivate theme
          </button>
        </div>
      </form>
    </div>
  );
}
