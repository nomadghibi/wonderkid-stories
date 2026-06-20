"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { childProfileSchema, type ChildProfileInput } from "@/lib/validation/child";
import Link from "next/link";
import { use } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolver = zodResolver(childProfileSchema) as any;

export default function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChildProfileInput>({
    resolver,
    defaultValues: { reading_level: "early_reader" },
  });

  useEffect(() => {
    fetch(`/api/children/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: data.name ?? "",
          age: data.age,
          gender: data.gender ?? "",
          skin_tone: data.skin_tone ?? "",
          hair_note: data.hair_note ?? "",
          favorite_color: data.favorite_color ?? "",
          favorite_animal: data.favorite_animal ?? "",
          favorite_sport: data.favorite_sport ?? "",
          reading_level: data.reading_level ?? "early_reader",
          notes: data.notes ?? "",
        });
        setFetchLoading(false);
      });
  }, [id, reset]);

  const onSubmit: SubmitHandler<ChildProfileInput> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/children/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Update failed");
      router.push(`/dashboard/children/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="flex items-center justify-center min-h-[40vh] text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href={`/dashboard/children/${id}`} className="text-sm text-[#6C63FF] hover:opacity-80">← Back to Profile</Link>
        <h1 className="text-2xl font-extrabold text-[#24304A] mt-2">Edit Child Profile</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Child&apos;s Name *</label>
            <input {...register("name")} className="input-field" placeholder="Emma" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Age</label>
            <input {...register("age")} type="number" min={1} max={18} className="input-field" placeholder="6" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#24304A] mb-1">Gender / Character Style</label>
          <select {...register("gender")} className="input-field">
            <option value="">Prefer not to say</option>
            <option value="girl">Girl</option>
            <option value="boy">Boy</option>
            <option value="non-binary">Non-binary / Any</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Skin Tone</label>
            <select {...register("skin_tone")} className="input-field">
              <option value="">Not specified</option>
              <option value="light">Light</option>
              <option value="medium-light">Medium-light</option>
              <option value="medium">Medium</option>
              <option value="medium-dark">Medium-dark</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Hair Description</label>
            <input {...register("hair_note")} className="input-field" placeholder="curly brown hair" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Favorite Color</label>
            <input {...register("favorite_color")} className="input-field" placeholder="purple" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Favorite Animal</label>
            <input {...register("favorite_animal")} className="input-field" placeholder="dolphin" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Favorite Sport</label>
            <input {...register("favorite_sport")} className="input-field" placeholder="soccer" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#24304A] mb-1">Reading Level</label>
          <select {...register("reading_level")} className="input-field">
            <option value="beginner">Beginner (Ages 3–5)</option>
            <option value="early_reader">Early Reader (Ages 5–7)</option>
            <option value="reader">Reader (Ages 7–9)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#24304A] mb-1">Extra Notes</label>
          <textarea {...register("notes")} rows={2} className="input-field resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href={`/dashboard/children/${id}`} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`.input-field { width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none; } .input-field:focus { border-color: #6C63FF; box-shadow: 0 0 0 3px rgba(108,99,255,0.1); }`}</style>
    </div>
  );
}
