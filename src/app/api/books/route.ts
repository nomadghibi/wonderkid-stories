import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBookSchema } from "@/lib/validation/book";
import { logAudit } from "@/lib/audit";
import { randomUUID } from "crypto";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("books")
    .select("*, story_themes(id, title, slug), child_profiles(id, name, age)")
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

  // Verify child belongs to user
  const { data: child } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("id", parsed.data.child_id)
    .eq("user_id", user.id)
    .single();
  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  const { data: book, error } = await supabase
    .from("books")
    .insert({
      user_id: user.id,
      child_id: parsed.data.child_id,
      theme_id: parsed.data.theme_id,
      dedication: parsed.data.dedication ?? null,
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
