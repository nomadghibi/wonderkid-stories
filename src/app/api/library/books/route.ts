import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject");

  const supabase = await createServiceClient();
  let query = supabase
    .from("library_books")
    .select("*, subjects(id, name, slug, emoji)")
    .eq("is_active", true)
    .order("sort_order");

  if (subject && subject !== "all") {
    query = query.eq("subjects.slug", subject);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Filter client-side when subject param given (Supabase doesn't filter on joined table in .eq)
  const filtered = subject && subject !== "all"
    ? (data ?? []).filter((b: { subjects?: { slug: string } | null }) => b.subjects?.slug === subject)
    : data;

  return NextResponse.json(filtered);
}
