# Design System

## Overview

This document defines the visual design system for NOMORA. The aesthetic is **cinematic, dark, editorial** — premium travel discovery, not a booking site.

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Midnight Forest | `#101918` | Main background (--background) |
| Deep Pine | `#1D302C` | Secondary backgrounds, cards (--secondary, --card) |
| Warm Bronze | `#B99A70` | Primary brand, accents, CTAs (--primary, --ring) |
| Stone | `#E5DDCE` | Secondary text, muted foreground (--muted-foreground) |
| Ivory | `#F7F5EF` | Primary text, headings (--foreground) |
| Charcoal | `#202623` | Alternative card surface |

### Semantic Colour Mappings

```css
:root {
  --background: #101918;        /* Midnight Forest */
  --foreground: #F7F5EF;        /* Ivory */
  --primary: #B99A70;           /* Warm Bronze */
  --primary-foreground: #101918;
  --secondary: #1D302C;         /* Deep Pine */
  --secondary-foreground: #F7F5EF;
  --muted: #1D302C;
  --muted-foreground: #E5DDCE;  /* Stone */
  --accent: #1D302C;
  --accent-foreground: #F7F5EF;
  --card: #1D302C;              /* Deep Pine */
  --card-foreground: #F7F5EF;
  --border: rgba(229, 221, 206, 0.2);
  --input: rgba(229, 221, 206, 0.3);
  --ring: #B99A70;
  --radius: 0.5rem;
}
```

### Gradients

```css
/* Hero gradients */
--gradient-hero-1: linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #b91c1c 100%);
--gradient-hero-2: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
--gradient-hero-3: linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #5b21b6 100%);

/* Card overlays */
--gradient-overlay: linear-gradient(180deg, transparent 40%, var(--background) 100%);
--gradient-overlay-strong: linear-gradient(180deg, transparent 20%, var(--background) 100%);

/* Text gradient */
--text-gradient-bronze: linear-gradient(135deg, #B99A70 0%, #E5DDCE 100%);
```

## Typography

### Font Families

| Role | Font | CSS Variable |
|------|------|--------------|
| Display / Headlines | Cormorant Garamond | `--font-cormorant` |
| Body / UI Text | Inter | `--font-inter` |
| Navigation / Buttons | Manrope | `--font-manrope` |

### Type Scale

| Token | Size (clamp) | Line Height | Letter Spacing | Usage |
|-------|--------------|-------------|----------------|-------|
| display-xl | clamp(3rem, 8vw, 6rem) | 1.1 | -0.02em | Hero headlines |
| display-lg | clamp(2.5rem, 6vw, 4.5rem) | 1.15 | -0.01em | Section headlines |
| display-md | clamp(2rem, 4vw, 3.5rem) | 1.2 | - | Large section titles |
| display-sm | clamp(1.5rem, 3vw, 2.5rem) | 1.25 | - | Card titles |
| heading-lg | clamp(1.5rem, 2.5vw, 2rem) | 1.3 | - | H2 |
| heading-md | clamp(1.25rem, 2vw, 1.5rem) | 1.35 | - | H3 |
| heading-sm | clamp(1.125rem, 1.5vw, 1.25rem) | 1.4 | - | H4 |
| body-lg | 1.125rem | 1.7 | - | Lead paragraphs |
| body-md | 1rem | 1.6 | - | Body text |
| body-sm | 0.875rem | 1.5 | - | Secondary text |
| caption | 0.75rem | 1.5 | - | Labels, meta |

### Font Weights

- **Cormorant**: 300, 400, 500, 600, 700
- **Inter**: 300, 400, 500, 600, 700
- **Manrope**: 300, 400, 500, 600, 700, 800

## Spacing

Base unit: 4px (0.25rem)

| Token | Value |
|-------|-------|
| space-18 | 4.5rem (72px) |
| space-22 | 5.5rem (88px) |
| space-30 | 7.5rem (120px) |

Section padding: `py-16 sm:py-24 lg:py-32`
Container max-width: `max-w-7xl` (1280px)

## Border Radius

- `lg`: 0.5rem (8px) — cards, modals
- `md`: 0.375rem (6px) — buttons, inputs
- `sm`: 0.25rem (4px) — badges, chips

## Shadows

- `sm`: Subtle depth for cards
- `md`: Hover state for interactive cards
- `lg`: Dropdowns, modals

## Transitions

- **Default**: 250ms cubic-bezier(0.16, 1, 0.3, 1) ("spring")
- **Slow**: 350ms for complex animations

## Components

### Button

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| Primary | Warm Bronze | Midnight Forest | - | Bronze 90% |
| Secondary | Deep Pine | Ivory | - | Deep Pine 80% |
| Outline | Transparent | Ivory | Stone/30 | Deep Pine / Ivory |
| Ghost | Transparent | Ivory | - | Deep Pine / Ivory |
| Link | Transparent | Warm Bronze | - | Underline |

Sizes: `sm` (px-4 py-2), `md` (px-6 py-3), `lg` (px-8 py-4)

### Card

- Background: Deep Pine (`--card`)
- Border: Stone/20 (`--border`)
- Radius: 0.5rem
- Shadow: sm → md on hover
- Hover variant: scale(1.02) + shadow-lg

### Input

- Background: Midnight Forest
- Border: Stone/30
- Focus: Warm Bronze ring
- Placeholder: Stone

### Section

- Padding: `section-padding` utility
- Container: `container-padded` utility

## Iconography

- **Library**: Lucide React (via shadcn/ui)
- **Stroke width**: 1.5–2
- **Size scale**: 16px (sm), 20px (md), 24px (lg), 32px (xl)

## Imagery

### Placeholders (Phase 1)
- CSS gradients only — no stock photos
- Each destination/category gets a consistent gradient identity
- Gradients derived from brand palette

### Production Guidelines (Future)
- High-resolution, authentic, cinematic
- Aspect ratios: 4:3 (cards), 16:9 (hero), 1:1 (gallery)
- WebP/AVIF via Cloudinary
- Alt text mandatory

## Motion & Interaction

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### Hover States
- Cards: scale(1.02) + shadow increase
- Buttons: background opacity shift
- Links: color transition + underline

### Focus States
- Visible ring: 2px Warm Bronze
- Offset: 2px Midnight Forest
- Never remove focus styles

## Accessibility

### Contrast Ratios (WCAG 2.2 AA)
| Pair | Ratio | Status |
|------|-------|--------|
| Ivory / Midnight Forest | 15.8:1 | ✅ AAA |
| Stone / Midnight Forest | 7.2:1 | ✅ AA |
| Warm Bronze / Midnight Forest | 4.8:1 | ✅ AA (large text) |
| Warm Bronze / Deep Pine | 3.2:1 | ⚠️ AA Large only |

**Note**: Warm Bronze on Deep Pine only for large text (≥18pt or ≥14pt bold). Use Ivory for body text on dark backgrounds.

### Keyboard Navigation
- All interactive elements reachable
- Visible focus indicators
- Skip link at top of page
- Logical tab order

### Screen Readers
- Semantic HTML5 elements
- ARIA labels on icon-only buttons
- Descriptive alt text
- Live regions for dynamic updates

## Dark Mode

- Default: Dark (Midnight Forest background)
- No light mode in Phase 1
- CSS variables allow future light theme

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Tablets |
| md | 768px | Small laptops |
| lg | 1024px | Desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Ultra-wide |

Container max-widths per breakpoint handled by `container-padded` utility.

---

*This design system is a living document. Update when components are added or refined.*