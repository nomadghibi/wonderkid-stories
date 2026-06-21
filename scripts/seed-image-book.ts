/**
 * seed-image-book.ts
 *
 * Creates a ready_made_image_pages library book from finished page images.
 *
 * Usage:
 *   npx tsx scripts/seed-image-book.ts
 *
 * Prerequisites:
 *   1. Copy your page images to public/books/<book-slug>/
 *      page-01.png, page-02.png, ... page-10.png
 *   2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   3. Edit BOOK_CONFIG and PAGES below.
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Configure your book here ──────────────────────────────────────────────────

const BOOK_CONFIG = {
  slug: "never-give-up-mia",
  title: "Never Give Up!",
  subtitle: "The Story of Mia and Her Big Goal",
  description: "A warm story about practice, patience, and learning that never giving up is the real win.",
  subjectSlug: "social-skills",
  readingLevel: "early_reader" as const,
  ageMin: 6,
  ageMax: 8,
  pageCount: 10,
  coverColor: "E11D48",
  coverImageUrl: "/books/never-give-up-mia/page-01.png",
  sortOrder: 20,
};

const PAGES = Array.from({ length: 10 }, (_, i) => ({
  pageNumber: i + 1,
  pageType: "story" as const,
  imageUrl: `/books/never-give-up-mia/page-${String(i + 1).padStart(2, "0")}.png`,
}));

// ── Seed ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding book: ${BOOK_CONFIG.title}`);

  // 1. Find subject
  const { data: subject, error: subjectErr } = await supabase
    .from("subjects")
    .select("id")
    .eq("slug", BOOK_CONFIG.subjectSlug)
    .single();

  if (subjectErr || !subject) {
    throw new Error(`Subject '${BOOK_CONFIG.subjectSlug}' not found. Run 010_library_seed.sql first.`);
  }

  // 2. Upsert book
  const { data: book, error: bookErr } = await supabase
    .from("library_books")
    .upsert({
      subject_id: subject.id,
      slug: BOOK_CONFIG.slug,
      title: BOOK_CONFIG.title,
      subtitle: BOOK_CONFIG.subtitle,
      description: BOOK_CONFIG.description,
      reading_level: BOOK_CONFIG.readingLevel,
      age_min: BOOK_CONFIG.ageMin,
      age_max: BOOK_CONFIG.ageMax,
      page_count: BOOK_CONFIG.pageCount,
      cover_image_url: BOOK_CONFIG.coverImageUrl,
      cover_color: BOOK_CONFIG.coverColor,
      book_type: "ready_made_image_pages",
      is_free: true,
      is_active: true,
      sort_order: BOOK_CONFIG.sortOrder,
    }, { onConflict: "slug" })
    .select("id")
    .single();

  if (bookErr || !book) throw new Error(`Book upsert failed: ${bookErr?.message}`);
  console.log(`Book ID: ${book.id}`);

  // 3. Upsert cover page (uses page-01 image)
  await supabase.from("library_book_pages").upsert({
    book_id: book.id,
    page_number: 0,
    page_type: "cover",
    title: BOOK_CONFIG.title,
    text_content: null,
    image_url: BOOK_CONFIG.coverImageUrl,
    layout_type: "image_only",
    has_embedded_text: true,
  }, { onConflict: "book_id,page_number" });

  // 4. Upsert story pages
  for (const page of PAGES) {
    const { error } = await supabase.from("library_book_pages").upsert({
      book_id: book.id,
      page_number: page.pageNumber,
      page_type: page.pageType,
      title: null,
      text_content: null,
      image_url: page.imageUrl,
      layout_type: "image_only",
      has_embedded_text: true,
    }, { onConflict: "book_id,page_number" });

    if (error) console.error(`Page ${page.pageNumber} error:`, error.message);
    else console.log(`  ✓ Page ${page.pageNumber}: ${page.imageUrl}`);
  }

  console.log(`\nDone! View at /library/${BOOK_CONFIG.slug}`);
  console.log(`Place images in public/books/${BOOK_CONFIG.slug.replace(/^never-give-up/, "never-give-up")}/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
