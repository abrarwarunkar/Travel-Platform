# Travel Discovery & Planning Platform

A premium travel discovery, inspiration, planning and community platform (codename NOMORA).

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd travel-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check TypeScript |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public route groups
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── common/            # Reusable UI components
│   ├── layout/            # Header, Footer, SkipLink
│   ├── destination/       # Destination-specific components
│   └── forms/             # Form components
├── config/
│   └── site.ts            # Site configuration
├── lib/
│   └── utils.ts           # Utility functions
└── styles/
    └── globals.css        # Global styles & Tailwind
```

## Design System

See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) for:
- Colour palette & gradients
- Typography scale
- Component specifications
- Accessibility guidelines

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for:
- Tech stack overview
- Project structure
- Architecture patterns
- Deployment guide

## Product Requirements

See [docs/PRD.md](docs/PRD.md) for the full product specification.

## Development Workflow

1. Create feature branch from `main`
2. Implement changes in small steps
3. Run quality checks: `npm run lint && npx tsc --noEmit && npm run build`
4. Test at mobile and desktop widths
5. Commit with clear message
6. Open PR for review

## Environment Variables

See `.env.example` for required variables. Never commit `.env.local`.

## Supabase Setup

### Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase stack
npx supabase start

# This starts:
# - PostgreSQL on localhost:54322
# - Supabase Studio on http://localhost:54323
# - Auth on localhost:54321
# - Storage on localhost:54323/storage

# Run migrations (creates schema, RLS, seeds data)
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/database.ts

# Open Supabase Studio
npx supabase studio
```

### Required Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# Optional: Production Supabase (for staging/prod)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

### Database Schema

The database includes 21 tables covering:
- **Core content**: destinations, guides, itineraries, attractions
- **User content**: trips, reviews, comments, community posts
- **System**: categories, countries, newsletter, media, reports
- **Full-text search** on destinations, guides, itineraries
- **Row Level Security** on all tables with role-based policies

See [DATABASE.md](DATABASE.md) for complete schema documentation.

### Migrations

Migrations are in `supabase/migrations/`:
- `001_core_schema.sql` — Tables, enums, indexes, triggers, full-text search
- `002_rls_policies.sql` — RLS policies and helper functions
- `seed.sql` — Reference data (10 countries, 8 categories, 4 destinations)

Apply to production:
```bash
npx supabase db push
```

## License

Proprietary — All rights reserved.