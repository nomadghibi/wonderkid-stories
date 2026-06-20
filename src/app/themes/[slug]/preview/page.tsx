import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import SampleReader from "@/components/reader/SampleReader";
import type { ReaderPage, ReaderBook } from "@/types/template";
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

function fillTemplate(text: string | null, child: SampleChildProfile): string {
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

  const sampleChild: SampleChildProfile = template.sample_child_profile ?? {
    name: "Alex",
    age: 7,
    favorite_color: "blue",
    favorite_animal: "dog",
    hair_note: "short brown hair",
    skin_tone: "medium",
  };

  const pages: ReaderPage[] = (template.template_pages ?? [])
    .sort((a, b) => a.page_number - b.page_number)
    .map((page) => ({
      pageNumber: page.page_number,
      pageType: page.page_type,
      title: fillTemplate(page.title_template, sampleChild),
      text: fillTemplate(page.placeholder_text, sampleChild) || fillTemplate(page.story_beat, sampleChild),
      imageUrl: null,
      layoutType: page.layout_type,
    }));

  const readerBook: ReaderBook = {
    id: null,
    title: fillTemplate(`${sampleChild.name}'s ${template.title}`, sampleChild),
    status: "sample",
    mode: "sample",
    templateSlug: template.slug,
    themeTitle: template.title,
    childName: sampleChild.name,
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/themes" className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-extrabold text-[#6C63FF]">WonderKid Stories</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">
              This is a sample preview using placeholder content.
            </span>
            <a
              href="/register"
              className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>

      {/* Preview notice banner */}
      <div className="bg-[#FFD166]/30 border-b border-[#FFD166] px-4 py-2.5 text-center">
        <p className="text-sm text-[#24304A] font-medium">
          📖 You're previewing <strong>{template.title}</strong> using sample content for a child named <strong>{sampleChild.name}</strong>.
          {" "}
          <a href="/register" className="text-[#6C63FF] font-bold hover:underline">
            Create your personalized version →
          </a>
        </p>
      </div>

      {/* Reader */}
      <div className="max-w-7xl mx-auto">
        <SampleReader book={readerBook} pages={pages} />
      </div>
    </div>
  );
}
