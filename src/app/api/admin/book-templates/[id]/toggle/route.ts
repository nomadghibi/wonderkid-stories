import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = await createServiceClient();
  const { data: template } = await service.from("book_templates").select("is_active").eq("id", id).single();
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await service.from("book_templates").update({ is_active: !template.is_active }).eq("id", id);
  return NextResponse.json({ is_active: !template.is_active });
}
