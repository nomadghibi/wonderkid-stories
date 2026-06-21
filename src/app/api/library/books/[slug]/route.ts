import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("library_books")
    .select("*, subjects(id, name, slug, emoji), library_book_pages(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .order("page_number", { referencedTable: "library_book_pages" })
    .single();

  if (error || !data) return NextResponse.json({ error: "Book not found" }, { status: 404 });
  return NextResponse.json(data);
}
