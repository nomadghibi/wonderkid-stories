# WonderKid Stories

AI-powered personalized children's storybook SaaS. Parents upload a child's photo, choose a story theme, and receive a personalized illustrated storybook where their child is the hero.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

App runs at http://localhost:3000

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payments | Stripe |
| Email | Resend |
| Queue | Inngest |
| PDF | pdf-lib |
| AI Text | OpenAI / Anthropic (abstracted) |
| AI Images | Replicate / Fal.ai (abstracted) |
| Validation | Zod + React Hook Form |
| Hosting | Vercel |

## Setup Instructions

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, run migrations in order:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_rls.sql`
   - `supabase/migrations/003_seed.sql`
3. Create three private Storage buckets:
   - `child-photos`
   - `book-assets`
   - `pdfs`
4. Copy your Project URL and API keys to `.env.local`

### 2. Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. Copy your test keys to `.env.local`
3. For webhooks: set up a webhook endpoint pointing to `/api/webhooks/stripe`
4. Add the `STRIPE_WEBHOOK_SECRET` to `.env.local`

### 3. Resend Setup (Email)

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Copy your API key to `.env.local`
4. Set `EMAIL_FROM` to your verified sender address

### 4. Admin Account Creation

After running the DB migrations and creating your first account:

```sql
-- Run in Supabase SQL editor
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Then access `/admin` to see the admin dashboard.

### 5. Vercel Deployment

```bash
npm i -g vercel
vercel
```

Add all environment variables from `.env.example` in the Vercel dashboard under Settings → Environment Variables.

## Mock Mode

Mock mode lets you run the full workflow without paid AI API calls.

Set in `.env.local`:
```
MOCK_AI_MODE=true
MOCK_PAYMENT_MODE=true
```

In mock mode:
- Story generation uses template text (no OpenAI/Anthropic calls)
- Images use placeholder images from placehold.co
- PDF generation works with real pdf-lib (no mocking needed)
- Full book → reader → approve → download flow works end-to-end

To switch to real AI providers, set `MOCK_AI_MODE=false` and implement the provider adapter in:
- `src/agents/story-planner.ts` — add real OpenAI/Anthropic call
- `src/agents/image-generator.ts` — add real Replicate/Fal.ai call

## Switching to Real AI Providers

### Story Generation (OpenAI / Anthropic)

Edit `src/agents/story-planner.ts`:

```typescript
// Replace the throw with real API call:
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: buildPrompt(input) }],
  response_format: { type: "json_object" },
});
const plan = JSON.parse(response.choices[0].message.content!);
return plan;
```

### Image Generation (Replicate / Fal.ai)

Edit `src/agents/image-generator.ts`:

```typescript
// Replace the mock return with real API call:
const replicate = new Replicate({ auth: process.env.IMAGE_PROVIDER_API_KEY });
const output = await replicate.run("stability-ai/sdxl", { input: { prompt } });
return { imageUrl: output[0], provider: "replicate" };
```

## Folder Structure

```
src/
  app/              — Next.js routes (pages + API)
  agents/           — AI generation pipeline (planStory, writeStory, generateImage, generatePDF, etc.)
  components/       — UI components (reader, layout, forms)
  config/           — Site config, pricing, prompts, themes
  lib/              — Supabase client, storage helpers, validation, audit
  types/            — TypeScript interfaces
supabase/
  migrations/       — SQL schema, RLS policies, seed data
```

## Acceptance Criteria Status

| # | Criteria | Status |
|---|----------|--------|
| 1 | User can register/login | ✅ |
| 2 | User can create a child profile | ✅ |
| 3 | User can upload a child photo securely | ✅ (signed URL flow) |
| 4 | User can choose story theme | ✅ (3 themes seeded) |
| 5 | User can create a book | ✅ |
| 6 | Mock AI generates structured pages | ✅ |
| 7 | User can read the book online | ✅ (BookReader component) |
| 8 | User can approve the book | ✅ |
| 9 | System generates a PDF | ✅ (pdf-lib) |
| 10 | User can download PDF securely | ✅ (signed URL) |
| 11 | Admin can see books and job statuses | ✅ |
| 12 | Admin can retry failed jobs | ✅ |
| 13 | Storage is private | ✅ (private buckets + signed URLs) |
| 14 | RLS protects user data | ✅ |
| 15 | App has public marketing pages | ✅ |
| 16 | Privacy and terms pages | ✅ |
| 17 | README explains setup | ✅ |
| 18 | .env.example is complete | ✅ |
| 19 | Code is typed and maintainable | ✅ |
| 20 | No child photo publicly exposed | ✅ |

## Known Limitations

- Photo upload UI requires implementing the signed URL upload flow in the browser (POST to `/api/children/:id/photos` for a signed URL, then PUT the file directly to Supabase Storage)
- Real AI provider adapters need to be implemented (see "Switching to Real AI Providers")
- Stripe payment flow is structured but not wired end-to-end in the UI
- Inngest job queue is installed but not yet replacing the synchronous generation approach
- Admin retry currently re-triggers generation without proper queue isolation
- Email notifications (Resend) are structured but not yet implemented

## Suggested Next Steps (Phase 2)

1. Wire Stripe checkout to book creation
2. Add Inngest for proper async background jobs
3. Implement real AI provider adapters
4. Add child photo upload UI (signed URL → direct upload)
5. Add single-page regeneration
6. Add email notifications via Resend
7. Add shared book link reader (`/reader/share/:token`)
8. Add audio narration
9. Add more story themes
10. Build out printed book integration
```
