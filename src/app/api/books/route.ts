import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createBookSchema } from "@/lib/validation/book";
import { logAudit } from "@/lib/audit";
import { randomUUID } from "crypto";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("books")
    .select("*, story_themes(id, title, slug), child_profiles(id, name, age), book_templates(id, slug, title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createBookSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { child_id, theme_id, template_id, dedication } = parsed.data;

  // Verify child belongs to user
  const { data: child } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("id", child_id)
    .eq("user_id", user.id)
    .single();
  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  // If template_id given, verify it's active
  if (template_id) {
    const svc = await createServiceClient();
    const { data: tpl } = await svc
      .from("book_templates")
      .select("id")
      .eq("id", template_id)
      .eq("is_active", true)
      .single();
    if (!tpl) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const { data: book, error } = await supabase
    .from("books")
    .insert({
      user_id: user.id,
      child_id,
      theme_id: theme_id ?? null,
      template_id: template_id ?? null,
      dedication: dedication ?? null,
      status: "draft",
      review_status: "not_ready",
      reader_share_token: randomUUID(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit(user.id, "book_created", "books", book.id);
  return NextResponse.json(book, { status: 201 });
}
