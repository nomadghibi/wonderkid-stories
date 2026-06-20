import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(2).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  category: z.string().max(50).nullable().optional(),
  age_min: z.number().int().min(0).max(18).optional(),
  age_max: z.number().int().min(0).max(18).optional(),
  page_count: z.number().int().min(5).max(30).optional(),
  is_active: z.boolean().optional(),
});

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const svc = await createServiceClient();
  const { data } = await svc.from("users").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

export async function GET(_req: Request, { params }: Params) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("story_themes")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: Params) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("story_themes")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const supabase = await createServiceClient();

  // Soft delete — just deactivate
  const { error } = await supabase
    .from("story_themes")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
