# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.0] - 2026-11-25

### Added
- Supabase database foundation (Phase 2)
  - Core schema migration (`001_core_schema.sql`): 21 tables, 2 enums, indexes, triggers
  - Full-text search with tsvector + GIN indexes on destinations, guides, itineraries
  - Row Level Security policies (`002_rls_policies.sql`): role-based access control
  - Seed data (`seed.sql`): 10 countries, 8 experience categories, 8 guide categories, 4 published destinations
  - Helper functions: `updated_at` triggers, search_vector updates, RLS helpers
- Supabase client helpers in `src/lib/supabase/`:
  - `browser.ts` - Client Components (createBrowserClient)
  - `server.ts` - Server Components/Actions (createServerClient)
  - `admin.ts` - Admin operations (service role key)
- TypeScript database types in `src/types/database.ts` (Row, Insert, Update, composite types)
- Data access layer in `src/services/destinations.ts`:
  - Published destinations with filtering, pagination, search
  - Featured destinations for homepage
  - Category/country-based queries
  - Full-text search and autocomplete
  - CRUD operations for admin/editor use
- Homepage integration: `FeaturedDestinationsSection` async component with Supabase data + fallback
- Documentation: `DATABASE.md` (complete schema docs), updated `README.md` with Supabase setup guide

### Changed
- Homepage now fetches featured destinations from Supabase (with static fallback)
- DestinationCard component accepts optional `heroImage` prop
- Updated `getFeaturedDestinations` to join country data

## [v0.1.0] - 2026-11-25

### Added
- Next.js 15 project with App Router, TypeScript, Tailwind CSS v4
- shadcn/ui (Base UI) component library initialization
- Core dependencies: zod, @supabase/supabase-js, @supabase/ssr, clsx, tailwind-merge
- Design system with brand colours (Midnight Forest, Deep Pine, Warm Bronze, Stone, Ivory, Charcoal)
- Typography: Cormorant Garamond (display), Inter (body), Manrope (navigation)
- Reusable components: Button, Card, Container, Section
- Layout components: Header (responsive with mobile menu), Footer, SkipLink
- Homepage with all PRD Section 5 requirements:
  - Hero with cinematic gradient, headline, CTA, destination search
  - Featured destinations (6 cards: Ladakh, Spiti Valley, Uttarakhand, Rajasthan, Kashmir, Kerala)
  - Explore by Experience (8 categories)
  - Featured Travel Stories (3 editorial cards)
  - AI Trip Planner promotion section
  - Newsletter signup form with consent checkbox
- SEO foundation:
  - Metadata with Open Graph, Twitter Cards, JSON-LD WebSite schema
  - sitemap.ts with static routes
  - robots.txt with AI bot exclusions
- Configuration:
  - src/config/site.ts with brand, navigation, constants
  - .env.example with all required environment variables
- Documentation:
  - ARCHITECTURE.md (technical architecture overview)
  - DESIGN-SYSTEM.md (complete design tokens and guidelines)
  - Updated README.md with setup instructions
- Quality tooling: ESLint, TypeScript strict mode

### Fixed
- Tailwind v4 configuration with @theme inline syntax
- Font loading via next/font/google
- Dark mode as default with CSS variables

### Deferred to Future Phases
- Supabase integration and database migrations (Phase 3)
- Destination/guide/itinerary detail pages (Phase 3-4)
- Authentication and user dashboard (Phase 4)
- AI Trip Planner implementation (Phase 5)
- Budget calculator (Phase 4)
- Interactive maps with Mapbox (Phase 4)
- Admin dashboard and content management (Phase 3)
- Newsletter API endpoint (Phase 3-4)
- Search API with PostgreSQL full-text search (Phase 3-4)
- Community features (Phase 7)

## [v0.0.0] - 2026-11-25

### Added
- Project initialization
- Git repository setup
- PRD.md as source of truth
- CLAUDE.md with project rules and workflow
- .gitignore for Next.js project
- README.md with project description