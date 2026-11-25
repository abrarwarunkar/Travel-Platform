# Technical Architecture

## Overview

This document describes the technical architecture of the NOMORA Travel Discovery & Planning Platform.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI) |
| Database | PostgreSQL (via Supabase) |
| Backend | Supabase (Auth, Database, RLS, Realtime) |
| AI | OpenAI API (server-side only) |
| Maps | Mapbox GL JS |
| Images | Cloudinary |
| Hosting | Vercel |
| Analytics | Privacy-conscious (TBD) |

## Project Structure

```
travel-platform/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── (public)/
│   │   ├── api/
│   │   ├── explore/
│   │   ├── destinations/
│   │   ├── guides/
│   │   ├── itineraries/
│   │   ├── trip-planner/
│   │   ├── stories/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── destination/
│   │   ├── search/
│   │   ├── itinerary/
│   │   ├── maps/
│   │   ├── forms/
│   │   └── common/
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── supabase/
│   │   └── validations/
│   ├── hooks/
│   ├── types/
│   ├── services/
│   └── config/
│       └── site.ts
├── supabase/
│   └── migrations/
├── tests/
├── .env.local
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── README.md
├── CHANGELOG.md
├── CLAUDE.md
├── ARCHITECTURE.md
├── DESIGN-SYSTEM.md
└── docs/
    └── PRD.md
```

## Architecture Patterns

### Server Components First
- Default to React Server Components
- Use Client Components only when necessary (interactivity, hooks, browser APIs)
- Keep client bundles minimal

### Data Fetching
- Server Components fetch data directly via Supabase client
- Use `async/await` in Server Components
- Client Components use SWR/React Query for mutations

### Authentication
- Supabase Auth with email/password and OAuth
- Server-side session management via `@supabase/ssr`
- RLS policies enforce permissions at database level

### API Routes
- Versioned under `/api/v1/`
- Zod validation on all inputs
- Rate limiting via middleware
- Structured error responses

### Security
- All secrets in `.env.local` (gitignored)
- API keys only used server-side
- RLS enabled on all tables
- CSP headers via Next.js config
- Input sanitization via Zod

### Performance
- Next.js Image optimization
- Font optimization via `next/font`
- Static generation where possible
- ISR for dynamic content
- Code splitting automatic

## Environment Variables

See `.env.example` for required variables.

## Deployment

- Vercel (connected to GitHub main branch)
- Preview deployments for PRs
- Environment variables configured in Vercel dashboard
- Supabase project linked for production

---

*This document will be expanded as the architecture evolves.*