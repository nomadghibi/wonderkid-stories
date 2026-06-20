import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { planStory } from "@/agents/story-planner";
import { reviewSafety } from "@/agents/safety-reviewer";
import { generateImage } from "@/agents/image-generator";
import { buildIllustrationPrompt } from "@/agents/illustration-prompt";
import { assembleBook } from "@/agents/book-assembler";
import { checkBookQuality } from "@/agents/quality-agent";
import { logAudit } from "@/lib/audit";
import { sendDraftReadyEmail, sendAdminFailureAlert } from "@/lib/email";
import { inngest } from "@/inngest/client";
import type { ChildProfile } from "@/types/child";
import type { StoryTheme } from "@/types/theme";

const MOCK_AI = process.env.MOCK_AI_MODE === "true";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id: bookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // In real mode, queue via Inngest and return immediately
  if (!MOCK_AI && process.env.INNGEST_EVENT_KEY) {
    await inngest.send({ name: "book/generate", data: { bookId, userId: user.id } });
    const serviceClient = await createServiceClient();
    await serviceClient.from("books").update({ status: "queued" }).eq("id", bookId);
    await logAudit(user.id, "book_generation_queued", "books", bookId);
    return NextResponse.json({ queued: true });
  }

  // Fetch book with child and theme
  const { data: book } = await supabase
    .from("books")
    .select("*, child_profiles(*), story_themes(*)")
    .eq("id", bookId)
    .eq("user_id", user.id)
    .single();

  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  if (!["draft", "failed"].includes(book.status)) {
    return NextResponse.json({ error: "Book is not in a generatable state" }, { status: 400 });
  }

  // Create job record
  const serviceClient = await createServiceClient();
  const { data: job } = await serviceClient
    .from("generation_jobs")
    .insert({
      book_id: bookId,
      user_id: user.id,
      job_type: "full_book_generation",
      status: "running",
      current_step: "story_generation",
      provider: "mock",
      attempt_count: 1,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  // Update book status
  await serviceClient
    .from("books")
    .update({ status: "story_generating" })
    .eq("id", bookId);

  try {
    const child = book.child_profiles as ChildProfile;
    const theme = book.story_themes as StoryTheme;

    // Step 1: Plan + write story
    await serviceClient
      .from("generation_jobs")
      .update({ current_step: "story_generation" })
      .eq("id", job?.id ?? "");

    const plan = await planStory({ child, theme, dedication: book.dedication ?? undefined });

    // Step 2: Safety review
    const safetyResult = await reviewSafety(plan);
    if (!safetyResult.passed) {
      throw new Error(`Safety check failed: ${safetyResult.issues.join(", ")}`);
    }

    // Step 3: Generate images
    await serviceClient
      .from("books")
      .update({ status: "images_generating" })
      .eq("id", bookId);
    await serviceClient
      .from("generation_jobs")
      .update({ current_step: "image_generation" })
      .eq("id", job?.id ?? "");

    const imageUrls: Record<number, string> = {};
    for (const page of plan.pages) {
      const prompt = buildIllustrationPrompt(page, child);
      const result = await generateImage(prompt);
      imageUrls[page.page_number] = result.imageUrl;
    }

    // Step 4: Assemble and save pages
    await serviceClient
      .from("generation_jobs")
      .update({ current_step: "assembling" })
      .eq("id", job?.id ?? "");

    const pageInserts = assembleBook(plan, bookId, imageUrls);

    // Insert cover page
    const allPages = [
      {
        book_id: bookId,
        page_number: 0,
        page_type: "cover",
        title: plan.title,
        text_content: plan.summary,
        image_url: `https://placehold.co/800x600/6C63FF/FFFFFF?text=${encodeURIComponent(plan.title)}`,
        status: "ready",
      },
      ...pageInserts,
    ];

    if (book.dedication) {
      allPages.splice(1, 0, {
        book_id: bookId,
        page_number: -1,
        page_type: "dedication",
        title: "A Special Message",
        text_content: book.dedication,
        image_url: null,
        status: "ready",
      });
    }

    await serviceClient.from("book_pages").delete().eq("book_id", bookId);
    await serviceClient.from("book_pages").insert(allPages);

    // Step 5: Quality check
    const { data: savedPages } = await serviceClient
      .from("book_pages")
      .select("*")
      .eq("book_id", bookId)
      .order("page_number");

    const quality = checkBookQuality(savedPages ?? []);
    if (!quality.passed) {
      console.warn("[generate] Quality issues:", quality.issues);
    }

    // Update title and mark ready
    await serviceClient
      .from("books")
      .update({ title: plan.title, status: "reader_ready", review_status: "not_ready" })
      .eq("id", bookId);

    await serviceClient
      .from("generation_jobs")
      .update({ status: "completed", current_step: "done", completed_at: new Date().toISOString() })
      .eq("id", job?.id ?? "");

    await logAudit(user.id, "book_generated", "books", bookId);

    // Send draft ready email (non-fatal)
    try {
      const { data: userProfile } = await serviceClient
        .from("users")
        .select("email, full_name")
        .eq("id", user.id)
        .single();
      if (userProfile?.email) {
        await sendDraftReadyEmail({
          to: userProfile.email,
          childName: child.name,
          bookTitle: plan.title,
          bookId,
          parentName: userProfile.full_name ?? undefined,
        });
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true, title: plan.title });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    await serviceClient
      .from("books")
      .update({ status: "failed" })
      .eq("id", bookId);

    await serviceClient
      .from("generation_jobs")
      .update({ status: "failed", error_message: message, completed_at: new Date().toISOString() })
      .eq("id", job?.id ?? "");

    // Alert admin (non-fatal)
    try {
      await sendAdminFailureAlert({ bookId, jobId: job?.id, errorMessage: message });
    } catch { /* non-fatal */ }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
