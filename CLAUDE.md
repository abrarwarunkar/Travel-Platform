---
# Travel Discovery & Planning Platform (codename NOMORA; brand name pending)

Source of truth: @docs/PRD.md. Check every decision against it. If a decision changes, update the PRD and CHANGELOG.md.

## Stack
Next.js (App Router, src/), TypeScript (strict), Tailwind, shadcn/ui, Supabase (Postgres, Auth, RLS), Mapbox, OpenAI (server-side only), Cloudinary, Vercel.
Don't add dependencies the current feature doesn't need.

## Rules
- Inspect existing code before editing. Make incremental changes. Don't rewrite working features.
- Brand name is a single config constant (src/config/site.ts). Never hardcode it, the domain, or any India-only assumption. Currency and locale are config-driven (default INR/en).
- Design tokens (Tailwind theme): Midnight Forest #101918, Deep Pine #1D302C, Warm Bronze #B99A70, Stone #E5DDCE, Ivory #F7F5EF, Charcoal #202623. Fonts: Cormorant Garamond (display), Inter (body), Manrope (nav). Cinematic, dark, editorial. It must not look like a booking site.
- Never fabricate ratings, visitor counts, reviews, prices, distances, permits, or road conditions. Seed data carries `last_verified` and a source record; unknown values are null, shown as "needs verification".
- Secrets only in .env.local (gitignored), used server-side only. Provide .env.example.
- All API routes: zod validation, auth and permission check, error handling, rate limiting, logging.
- RLS on every table. Never rely on frontend checks for permissions.
- Accessibility: WCAG 2.2 AA, keyboard nav, focus states, alt text, reduced motion. Mobile-first.
- SEO: server-rendered pages, unique metadata, canonical URLs, sitemap, robots, JSON-LD, breadcrumbs.

## Workflow per feature
Plan first (list files to touch) → implement in small steps → `npm run lint && npx tsc --noEmit && npm run build` → test desktop and mobile widths → fix → commit on a feature branch with a clear message. Don't declare done until all pass.

## Commands
dev: `npm run dev` | lint: `npm run lint` | types: `npx tsc --noEmit` | test: `npm test`
---