import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const themeSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  age_min: z.number().int().min(0).max(18),
  age_max: z.number().int().min(0).max(18),
  page_count: z.number().int().min(5).max(30),
  is_active: z.boolean(),
});

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const svc = await createServiceClient();
  const { data } = await svc.from("users").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const supabase = await createServiceClient();
  const { data, error } = await supabase.from("story_themes").select("*").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const parsed = themeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("story_themes")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
