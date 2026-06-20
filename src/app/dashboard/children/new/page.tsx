"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { childProfileSchema, type ChildProfileInput } from "@/lib/validation/child";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolver = zodResolver(childProfileSchema) as any;

export default function NewChildPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ChildProfileInput>({
    resolver,
    defaultValues: { reading_level: "early_reader" },
  });

  const onSubmit: SubmitHandler<ChildProfileInput> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error?.formErrors?.[0] ?? j.error ?? "Failed to create profile");
      }
      const child = await res.json();
      router.push(`/dashboard/children/${child.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/children" className="text-sm text-[#6C63FF] hover:opacity-80">← Back to Children</Link>
        <h1 className="text-2xl font-extrabold text-[#24304A] mt-2">Add a Child Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">This information personalizes your child's story.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        {/* Name + Age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Child's Name *</label>
            <input {...register("name")} className="input-field" placeholder="Emma" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">Age</label>
            <input {...register("age")} type="number" min={1} max={18} className="input-field" placeholder="6" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-[#24304A] mb-1">Gender / Character Style</label>
          <select {...register("gender")} className="input-field">
            <option value="">Prefer not to say</option>
            <option value="girl">Girl</option>
            <option value="boy">Boy</option>
            <option value="non-binary">Non-binary / Any</option>
          </select>
        </div>

        {/* Appearance */}
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

        {/* Favorites */}
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

        {/* Reading level */}
        <div>
          <label className="block text-sm font-semibold text-[#24304A] mb-1">Reading Level</label>
          <select {...register("reading_level")} className="input-field">
            <option value="beginner">Beginner (Ages 3–5, very simple words)</option>
            <option value="early_reader">Early Reader (Ages 5–7, short sentences)</option>
            <option value="reader">Reader (Ages 7–9, longer paragraphs)</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-[#24304A] mb-1">Extra Details <span className="font-normal text-gray-400">(optional)</span></label>
          <textarea {...register("notes")} rows={2} className="input-field resize-none" placeholder="E.g. loves dinosaurs, scared of dark, has a dog named Biscuit..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            {loading ? "Saving..." : "Save Child Profile"}
          </button>
          <Link href="/dashboard/children" className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`.input-field { width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none; transition: border-color 0.15s; } .input-field:focus { border-color: #6C63FF; box-shadow: 0 0 0 3px rgba(108,99,255,0.1); }`}</style>
    </div>
  );
}
