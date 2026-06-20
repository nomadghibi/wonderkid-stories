import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("book_templates")
    .select("id, slug, title, subtitle, description, category, age_min, age_max, page_count, price_cents, sample_cover_url, illustration_style")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
