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

## License

Proprietary — All rights reserved.