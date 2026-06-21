import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import RealBookReader from "@/components/reader/RealBookReader";
import type { BookReaderData, BookReaderPage } from "@/types/reader";
import type { BookTemplateWithPages, SampleChildProfile } from "@/types/template";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("book_templates")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!data) return {};
  return {
    title: `Preview: ${data.title} — WonderKid Stories`,
    description: data.description ?? undefined,
  };
}

function fill(text: string | null, child: SampleChildProfile): string {
  if (!text) return "";
  return text
    .replace(/\{\{child_name\}\}/g, child.name)
    .replace(/\{\{age\}\}/g, String(child.age))
    .replace(/\{\{favorite_color\}\}/g, child.favorite_color ?? "blue")
    .replace(/\{\{favorite_animal\}\}/g, child.favorite_animal ?? "dog")
    .replace(/\{\{hair_note\}\}/g, child.hair_note ?? "neat hair")
    .replace(/\{\{skin_tone\}\}/g, child.skin_tone ?? "medium");
}

export default async function TemplatePreviewPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  const { data: template } = await supabase
    .from("book_templates")
    .select("*, template_pages(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single() as { data: BookTemplateWithPages | null };

  if (!template) notFound();

  const child: SampleChildProfile = template.sample_child_profile ?? {
    name: "Alex",
    age: 7,
    favorite_color: "blue",
    favorite_animal: "dog",
    hair_note: "short brown hair",
    skin_tone: "medium",
  };

  const sortedPages = (template.template_pages ?? [])
    .sort((a, b) => a.page_number - b.page_number);

  const readerPages: BookReaderPage[] = sortedPages.map(page => ({
    pageNumber: page.page_number,
    pageType: page.page_type as BookReaderPage["pageType"],
    title: fill(page.title_template, child),
    text: fill(page.placeholder_text ?? page.story_beat, child),
    imageUrl: undefined,
    layoutType: page.layout_type,
  }));

  const readerData: BookReaderData = {
    id: `preview-${template.slug}`,
    title: `${child.name}'s ${template.title}`,
    childName: child.name,
    coverImageUrl: undefined,
    mode: "sample",
    templateSlug: template.slug,
    pages: readerPages,
  };

  return (
    <RealBookReader
      data={readerData}
      backHref="/themes"
      backLabel="Browse Templates"
    />
  );
}
