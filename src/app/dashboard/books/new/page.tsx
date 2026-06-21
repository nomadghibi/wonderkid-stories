"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ChildProfile } from "@/types/child";
import type { StoryTheme } from "@/types/theme";
import { THEME_EMOJIS } from "@/config/themes";
import { useToast } from "@/hooks/use-toast";

interface BookTemplate {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  age_min: number | null;
  age_max: number | null;
  page_count: number;
  price_cents: number;
}

async function safeJson(res: Response) {
  try {
    const text = await res.text();
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// ── Inner component (uses useSearchParams) ─────────────────────────────────
function NewBookInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get("template");
  const { toast } = useToast();

  // Template-first flow: child → review (2 steps)
  // Classic flow: child → theme → review (3 steps)
  const totalSteps = templateSlug ? 2 : 3;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [themes, setThemes] = useState<StoryTheme[]>([]);
  const [template, setTemplate] = useState<BookTemplate | null>(null);
  const [templateLoading, setTemplateLoading] = useState(!!templateSlug);

  const [selectedChild, setSelectedChild] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [dedication, setDedication] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Always fetch children
    fetch("/api/children")
      .then((r) => r.json())
      .then((c) => setChildren(Array.isArray(c) ? c : []));

    if (templateSlug) {
      // Template flow: fetch template metadata
      fetch(`/api/book-templates/${templateSlug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.id) setTemplate(data as BookTemplate);
        })
        .finally(() => setTemplateLoading(false));
    } else {
      // Classic flow: fetch themes
      fetch("/api/themes")
        .then((r) => r.json())
        .then((t) => setThemes(Array.isArray(t) ? t : []));
    }
  }, [templateSlug]);

  async function handleCreate() {
    setLoading(true);
    try {
      // 1. Create book record
      const bookPayload = templateSlug && template
        ? { child_id: selectedChild, template_id: template.id, dedication }
        : { child_id: selectedChild, theme_id: selectedTheme, dedication };

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookPayload),
      });
      const bookData = await safeJson(res);
      if (!res.ok) {
        toast({ title: "Couldn't create book", description: String(bookData.error ?? `Error ${res.status}`), variant: "error" });
        setLoading(false);
        return;
      }
      const bookId = bookData.id as string;

      // 2. Checkout (mock bypasses Stripe)
      const checkoutRes = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: bookId, product: "singleBook" }),
      });
      const checkout = await safeJson(checkoutRes);
      if (!checkoutRes.ok) {
        const msg = checkoutRes.status === 429
          ? "Too many requests — please wait a moment and try again."
          : String(checkout.error ?? `Checkout error ${checkoutRes.status}`);
        toast({ title: "Payment error", description: msg, variant: "error" });
        setLoading(false);
        return;
      }

      if (checkout.url) {
        window.location.href = checkout.url as string;
        return;
      }

      // 3. Trigger generation
      const genRes = await fetch(`/api/books/${bookId}/generate`, { method: "POST" });
      const genData = await safeJson(genRes);

      if (genRes.status === 429) {
        toast({ title: "Slow down!", description: "You've reached the generation limit. Try again in an hour.", variant: "error" });
        setLoading(false);
        return;
      }

      if (!genRes.ok) {
        toast({ title: "Generation failed", description: String(genData.error ?? "Unknown error"), variant: "error" });
        setLoading(false);
        return;
      }

      if (genData.queued) {
        toast({ title: "Book queued!", description: "We'll email you when your storybook is ready.", variant: "success" });
        router.push(`/dashboard/books/${bookId}`);
        return;
      }

      toast({ title: "Storybook created!", description: "Your personalized story is ready to read.", variant: "success" });
      router.push(`/dashboard/books/${bookId}/reader`);
    } catch (e) {
      toast({ title: "Something went wrong", description: e instanceof Error ? e.message : "Please try again.", variant: "error" });
      setLoading(false);
    }
  }

  const selectedChildObj = children.find((c) => c.id === selectedChild);
  const selectedThemeObj = themes.find((t) => t.id === selectedTheme);

  // Step labels differ by flow
  const stepLabels = templateSlug
    ? ["Choose child", "Review & create"]
    : ["Choose child", "Choose adventure", "Review & create"];

  if (templateLoading) {
    return (
      <div className="max-w-2xl flex items-center justify-center py-20">
        <span className="text-gray-400 text-sm">Loading template...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/books" className="text-sm text-[#6C63FF] hover:opacity-80">← Back to Books</Link>
        <h1 className="text-2xl font-extrabold text-[#24304A] mt-2">
          {template ? `Create: ${template.title}` : "Create a New Book ✨"}
        </h1>
        {template?.description && (
          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-[#6C63FF] text-white" : "bg-gray-100 text-gray-400"}`}>
              {s}
            </div>
            {s < totalSteps && (
              <div className={`w-12 h-1 rounded-full ${step > s ? "bg-[#6C63FF]" : "bg-gray-100"}`} />
            )}
          </div>
        ))}
        <div className="ml-2 text-sm text-gray-500">
          {stepLabels[step - 1]}
        </div>
      </div>

      {/* ── Step 1: Choose child ── */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-bold text-[#24304A]">Who is this story for?</h2>
          {children.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-gray-500 text-sm mb-4">No child profiles yet.</p>
              <Link
                href="/dashboard/children/new"
                className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2.5 rounded-xl"
              >
                Add a Child First
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChild(child.id);
                    // Template flow: skip to step 2 (review), classic: step 2 (theme)
                    setStep(templateSlug ? 2 : 2);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedChild === child.id ? "border-[#6C63FF] bg-purple-50" : "border-gray-100 bg-white hover:border-[#6C63FF]/50"}`}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                    👦
                  </div>
                  <div>
                    <div className="font-bold text-[#24304A]">{child.name}</div>
                    <div className="text-sm text-gray-500">
                      Age {child.age} · {child.reading_level?.replace("_", " ")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2 (classic flow only): Choose theme ── */}
      {step === 2 && !templateSlug && (
        <div className="space-y-4">
          <h2 className="font-bold text-[#24304A]">Choose an Adventure for {selectedChildObj?.name}</h2>
          <div className="grid gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => { setSelectedTheme(theme.id); setStep(3); }}
                className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left ${selectedTheme === theme.id ? "border-[#6C63FF] bg-purple-50" : "border-gray-100 bg-white hover:border-[#6C63FF]/50"}`}
              >
                <div className="text-3xl">{THEME_EMOJIS[theme.slug] ?? "📖"}</div>
                <div>
                  <div className="font-bold text-[#24304A]">{theme.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{theme.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Ages {theme.age_min}–{theme.age_max} · {theme.page_count} pages
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">
            ← Change child
          </button>
        </div>
      )}

      {/* ── Review & Create step ── */}
      {((step === 2 && !!templateSlug) || (step === 3 && !templateSlug)) && (
        <div className="space-y-6">
          <h2 className="font-bold text-[#24304A]">Almost ready!</h2>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Child</span>
              <span className="font-semibold text-[#24304A]">
                {selectedChildObj?.name}, age {selectedChildObj?.age}
              </span>
            </div>

            {template ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Book</span>
                  <span className="font-semibold text-[#24304A]">{template.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pages</span>
                  <span className="font-semibold text-[#24304A]">{template.page_count} story pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-semibold text-[#6C63FF]">{formatPrice(template.price_cents)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Adventure</span>
                  <span className="font-semibold text-[#24304A]">
                    {THEME_EMOJIS[selectedThemeObj?.slug ?? ""]} {selectedThemeObj?.title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pages</span>
                  <span className="font-semibold text-[#24304A]">{selectedThemeObj?.page_count} story pages</span>
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#24304A] mb-1">
              Dedication Message{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] resize-none"
              placeholder='E.g. "To Emma — may you always be the hero of your own story. Love, Grandma 💜"'
            />
            <div className="text-right text-xs text-gray-400">{dedication.length}/300</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin">⏳</span> Creating your story...</>
              ) : (
                <>✨ Create Storybook</>
              )}
            </button>
            <button
              onClick={() => setStep(templateSlug ? 1 : 2)}
              disabled={loading}
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
            >
              ← Back
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            In mock mode, your book generates instantly. In production, this takes 1–2 minutes.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Page wrapper (Suspense required for useSearchParams) ────────────────────
export default function NewBookPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl flex items-center justify-center py-20">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    }>
      <NewBookInner />
    </Suspense>
  );
}
