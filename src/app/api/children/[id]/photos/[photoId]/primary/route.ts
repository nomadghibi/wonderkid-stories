import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string; photoId: string }> };

export async function PATCH(_req: Request, { params }: Params) {
  const { id: childId, photoId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify child belongs to user
  const { data: child } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .single();
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Clear existing primary
  await supabase
    .from("child_photos")
    .update({ is_primary: false })
    .eq("child_id", childId);

  // Set new primary
  const { error } = await supabase
    .from("child_photos")
    .update({ is_primary: true })
    .eq("id", photoId)
    .eq("child_id", childId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
