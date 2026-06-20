import { inngest } from "@/inngest/client";
import { createServiceClient } from "@/lib/supabase/server";
import { planStory } from "@/agents/story-planner";
import { reviewSafety } from "@/agents/safety-reviewer";
import { generateImage } from "@/agents/image-generator";
import { buildIllustrationPrompt } from "@/agents/illustration-prompt";
import { assembleBook } from "@/agents/book-assembler";
import { checkBookQuality } from "@/agents/quality-agent";
import { sendDraftReadyEmail, sendAdminFailureAlert } from "@/lib/email";
import { BUCKETS } from "@/lib/storage";
import type { ChildProfile } from "@/types/child";
import type { StoryTheme } from "@/types/theme";

export const generateBookFunction = inngest.createFunction(
  {
    id: "generate-book",
    name: "Generate Book",
    retries: 2,
    concurrency: { limit: 5 },
    triggers: [{ event: "book/generate" as const }],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ event, step }: any) => {
    const { bookId, userId } = event.data;
    const supabase = await createServiceClient();

    // Fetch book
    const book = await step.run("fetch-book", async () => {
      const { data } = await supabase
        .from("books")
        .select("*, child_profiles(*), story_themes(*)")
        .eq("id", bookId)
        .single();
      return data;
    });

    if (!book) throw new Error(`Book ${bookId} not found`);

    // Create job record
    const job = await step.run("create-job", async () => {
      const { data } = await supabase
        .from("generation_jobs")
        .insert({
          book_id: bookId,
          user_id: userId,
          job_type: "full_book_generation",
          status: "running",
          current_step: "story_generation",
          provider: process.env.MOCK_AI_MODE === "true" ? "mock" : "openai",
          attempt_count: 1,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      return data;
    });

    await step.run("set-story-generating", async () => {
      await supabase.from("books").update({ status: "story_generating" }).eq("id", bookId);
    });

    // Generate story plan
    const plan = await step.run("generate-story", async () => {
      const child = book.child_profiles as ChildProfile;
      const theme = book.story_themes as StoryTheme;
      return planStory({ child, theme, dedication: book.dedication ?? undefined });
    });

    // Safety check
    await step.run("safety-check", async () => {
      const result = await reviewSafety(plan);
      if (!result.passed) {
        throw new Error(`Safety check failed: ${result.issues.join(", ")}`);
      }
    });

    // Generate images
    await step.run("set-images-generating", async () => {
      await supabase
        .from("books")
        .update({ status: "images_generating" })
        .eq("id", bookId);
      if (job) {
        await supabase
          .from("generation_jobs")
          .update({ current_step: "image_generation" })
          .eq("id", job.id);
      }
    });

    const imageUrls = await step.run("generate-images", async () => {
      const child = book.child_profiles as ChildProfile;
      const urls: Record<number, string> = {};
      for (const page of plan.pages) {
        const prompt = buildIllustrationPrompt(page, child);
        const result = await generateImage(prompt);

        if (result.buffer) {
          const storagePath = `users/${userId}/books/${bookId}/pages/page-${page.page_number}.png`;
          const { error: uploadErr } = await supabase.storage
            .from(BUCKETS.bookAssets)
            .upload(storagePath, result.buffer, { contentType: "image/png", upsert: true });
          urls[page.page_number] = uploadErr ? result.imageUrl : storagePath;
        } else {
          urls[page.page_number] = result.imageUrl;
        }
      }
      return urls;
    });

    // Assemble and save pages
    await step.run("save-pages", async () => {
      const pageInserts = assembleBook(plan, bookId, imageUrls);
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
      await supabase.from("book_pages").delete().eq("book_id", bookId);
      await supabase.from("book_pages").insert(allPages);
    });

    // Quality check + mark ready
    await step.run("finalize", async () => {
      const { data: savedPages } = await supabase
        .from("book_pages")
        .select("*")
        .eq("book_id", bookId)
        .order("page_number");

      const quality = checkBookQuality(savedPages ?? []);
      if (!quality.passed) {
        console.warn("[inngest] Quality issues:", quality.issues);
      }

      await supabase
        .from("books")
        .update({ title: plan.title, status: "reader_ready", review_status: "not_ready" })
        .eq("id", bookId);

      if (job) {
        await supabase
          .from("generation_jobs")
          .update({ status: "completed", current_step: "done", completed_at: new Date().toISOString() })
          .eq("id", job.id);
      }
    });

    // Send email
    await step.run("send-email", async () => {
      const { data: userProfile } = await supabase
        .from("users")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (userProfile?.email) {
        const child = book.child_profiles as ChildProfile;
        await sendDraftReadyEmail({
          to: userProfile.email,
          childName: child.name,
          bookTitle: plan.title,
          bookId,
          parentName: userProfile.full_name ?? undefined,
        });
      }
    });

    return { bookId, title: plan.title, status: "reader_ready" };
  }
);

// Export failure handler
export const generateBookFailureFunction = inngest.createFunction(
  {
    id: "generate-book-failure",
    name: "Handle Book Generation Failure",
    triggers: [{ event: "inngest/function.failed" as const }],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ event, step }: any) => {
    const originalEvent = event.data.event;
    if (originalEvent.name !== "book/generate") return;

    const { bookId } = originalEvent.data as { bookId: string; userId: string };
    const errorMessage = event.data.error?.message ?? "Unknown error";

    const supabase = await createServiceClient();

    await step.run("mark-failed", async () => {
      await supabase.from("books").update({ status: "failed" }).eq("id", bookId);
      await supabase
        .from("generation_jobs")
        .update({ status: "failed", error_message: errorMessage, completed_at: new Date().toISOString() })
        .eq("book_id", bookId)
        .eq("status", "running");
    });

    await step.run("alert-admin", async () => {
      await sendAdminFailureAlert({ bookId, errorMessage });
    });
  }
);
