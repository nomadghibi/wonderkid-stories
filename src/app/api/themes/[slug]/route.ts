import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("story_themes")
    .select("*, story_templates(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  return NextResponse.json(data);
}
