# Database Documentation

## Overview

This document describes the PostgreSQL database schema for the Travel Discovery & Planning Platform, implemented with Supabase (PostgreSQL + Auth + Row Level Security).

## Schema Design Principles

- **Country-agnostic**: Schema supports multiple countries without modification
- **UUID Primary Keys**: All tables use `uuid_generate_v4()` for globally unique identifiers
- **Audit Trail**: All tables include `created_at` and `updated_at` timestamps with automatic triggers
- **Full-Text Search**: Destinations, guides, and itineraries include `tsvector` columns with GIN indexes
- **Row Level Security**: All tables have RLS enabled with role-based policies
- **Soft Deletes**: Content uses `publication_status` enum (`draft`, `published`, `archived`) instead of hard deletes

## Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `publication_status` | `draft`, `published`, `archived` | Content lifecycle state |
| `user_role` | `super_admin`, `content_editor`, `moderator`, `contributor`, `user` | User permissions hierarchy |

## Tables

### Core Reference Tables

#### `countries`
Reference data for countries.
- `id` (PK), `name`, `slug` (unique), `iso_code` (unique, CHAR(2)), `currency_code` (CHAR(3)), `created_at`

#### `categories`
Travel experience categories (Mountains, Beaches, Culture, etc.).
- `id` (PK), `name`, `slug` (unique), `description`, `icon`, `created_at`

#### `guide_categories`
Categories for travel guides/articles.
- `id` (PK), `name`, `slug` (unique), `description`, `created_at`

### User & Profile Tables

#### `profiles`
Extends `auth.users` with profile data.
- `id` (PK, FK→auth.users), `display_name`, `username` (unique), `avatar_url`, `bio`, `home_country` (FK→countries), `travel_interests` (text[]), `role` (user_role), `created_at`, `updated_at`
- **Trigger**: Auto-create profile on auth signup

### Content Tables

#### `destinations`
Core destination content.
- `id` (PK), `country_id` (FK→countries), `name`, `slug`, `state_region`, `city`, `latitude`, `longitude`, `short_description`, `detailed_description`, `hero_image`, `gallery_images` (text[]), `best_seasons` (text[]), `avg_duration_days`, `budget_guidance`, `travel_difficulty`, `publication_status`, `seo_title`, `seo_description`, `last_verified`, `created_at`, `updated_at`, `search_vector` (tsvector)
- **Unique Index**: `(country_id, slug)`
- **Indexes**: `country_id`, `publication_status`, `slug`, `search_vector` (GIN), `last_verified`
- **Triggers**: `update_updated_at_column`, `update_destinations_search_vector`

#### `destination_images`
Gallery images for destinations.
- `id` (PK), `destination_id` (FK→destinations), `url`, `alt_text`, `sort_order`, `created_at`

#### `attractions`
Points of interest within destinations.
- `id` (PK), `destination_id` (FK→destinations), `name`, `slug`, `description`, `latitude`, `longitude`, `category`, `created_at`
- **Unique Index**: `(destination_id, slug)`

#### `destination_categories`
Many-to-many: destinations ↔ categories.
- `destination_id` (FK), `category_id` (FK), **PK** (`destination_id`, `category_id`)

#### `guides`
Travel articles and guides.
- `id` (PK), `title`, `slug` (unique), `excerpt`, `content`, `featured_image`, `author_id` (FK→profiles), `category_id` (FK→guide_categories), `publication_status`, `seo_title`, `seo_description`, `last_verified`, `published_at`, `created_at`, `updated_at`, `search_vector` (tsvector)
- **Indexes**: `author_id`, `category_id`, `publication_status`, `slug`, `search_vector` (GIN), `published_at`
- **Triggers**: `update_updated_at_column`, `update_guides_search_vector`

#### `itineraries`
Multi-day travel itineraries.
- `id` (PK), `title`, `slug` (unique), `destination_id` (FK→destinations), `duration_days`, `start_location`, `end_location`, `travel_mode`, `estimated_budget`, `budget_currency` (CHAR(3), default 'INR'), `recommended_season`, `description`, `publication_status`, `author_id` (FK→profiles), `last_verified`, `published_at`, `created_at`, `updated_at`, `search_vector` (tsvector)
- **Indexes**: `destination_id`, `author_id`, `publication_status`, `slug`, `search_vector` (GIN), `published_at`
- **Triggers**: `update_updated_at_column`, `update_itineraries_search_vector`

#### `itinerary_days`
Days within an itinerary.
- `id` (PK), `itinerary_id` (FK→itineraries), `day_number`, `title`, `description`, `start_point`, `end_point`, `distance_km`, `duration_hours`, `accommodation_area`, `notes`, `created_at`
- **Unique Index**: `(itinerary_id, day_number)`

#### `itinerary_stops`
Stops within an itinerary day.
- `id` (PK), `itinerary_day_id` (FK→itinerary_days), `stop_order`, `name`, `description`, `latitude`, `longitude`, `stop_type`, `duration_minutes`, `created_at`

### User Content Tables

#### `trips`
User-created trip plans.
- `id` (PK), `user_id` (FK→profiles), `title`, `description`, `destination_id` (FK→destinations, nullable), `start_date`, `end_date`, `budget_estimate`, `budget_currency` (default 'INR'), `status` (default 'planning'), `is_public` (default false), `created_at`, `updated_at`

#### `trip_members`
Collaborators on trips.
- `id` (PK), `trip_id` (FK→trips), `user_id` (FK→profiles), `role` (default 'viewer'), `created_at`
- **Unique Index**: `(trip_id, user_id)`

#### `saved_destinations`
User bookmarks for destinations.
- `user_id` (FK→profiles), `destination_id` (FK→destinations), `created_at`, **PK** (`user_id`, `destination_id`)

#### `saved_itineraries`
User bookmarks for itineraries.
- `user_id` (FK→profiles), `itinerary_id` (FK→itineraries), `created_at`, **PK** (`user_id`, `itinerary_id`)

### Community Tables

#### `reviews`
User reviews for destinations.
- `id` (PK), `user_id` (FK→profiles), `destination_id` (FK→destinations), `rating` (1-5), `title`, `content`, `status` (default 'pending'), `created_at`, `updated_at`

#### `comments`
Comments on guides, itineraries, community posts.
- `id` (PK), `user_id` (FK→profiles), `parent_type` (guide/itinerary/community_post), `parent_id`, `content`, `status` (default 'published'), `created_at`, `updated_at`

#### `community_posts`
User-generated community content.
- `id` (PK), `user_id` (FK→profiles), `title`, `content`, `media_ids` (uuid[]), `status` (default 'draft'), `created_at`, `updated_at`

#### `media`
Uploaded media files.
- `id` (PK), `user_id` (FK→profiles), `url`, `type`, `alt_text`, `created_at`

### System Tables

#### `newsletter_subscribers`
Email newsletter subscriptions.
- `id` (PK), `email` (unique), `interests` (text[]), `consent` (default false), `status` (default 'active'), `created_at`

#### `content_sources`
Provenance tracking for content.
- `id` (PK), `table_name`, `record_id`, `source_url`, `source_title`, `verified_date`, `created_at`

#### `reports`
Content moderation reports.
- `id` (PK), `reporter_id` (FK→profiles), `target_type` (guide/itinerary/community_post/comment/review/profile), `target_id`, `reason`, `status` (default 'open'), `resolved_by` (FK→profiles), `resolved_at`, `created_at`

## Row Level Security (RLS) Policies

All tables have RLS enabled. Policies follow these principles:

### Public Read Access
- `countries`, `categories`, `guide_categories`: Public read
- `destinations`, `guides`, `itineraries`: Published content readable by all
- `profiles`: Basic info readable by all

### Role-Based Write Access
| Role | Permissions |
|------|-------------|
| `super_admin` | Full access to all tables |
| `content_editor` | Manage destinations, guides, itineraries, categories |
| `moderator` | Manage reviews, comments, community_posts, reports, media |
| `contributor` | Create own guides, itineraries, community_posts |
| `user` | Manage own profile, trips, saved items, reviews, comments |

### Ownership Policies
- Users can **read/update/insert** their own: `profiles`, `trips`, `saved_destinations`, `saved_itineraries`, `reviews`, `comments`, `community_posts`, `media`, `newsletter_subscribers`
- Trip owners can manage `trip_members`
- Authors can manage their own `guides`, `itineraries` (and associated `itinerary_days`, `itinerary_stops`)

### Helper Functions
```sql
is_super_admin()           -- Returns true if current user is super_admin
is_content_editor_or_higher()  -- Returns true for super_admin, content_editor
is_moderator_or_higher()   -- Returns true for super_admin, content_editor, moderator
is_owner(user_id)          -- Returns true if current user owns the resource
is_trip_member(trip_id)    -- Returns true if current user is member of trip
```

## Full-Text Search

Three tables have `search_vector` (tsvector) columns with GIN indexes:

### Destinations
```sql
search_vector :=
  setweight(to_tsvector('english', name), 'A') ||
  setweight(to_tsvector('english', short_description), 'B') ||
  setweight(to_tsvector('english', detailed_description), 'C') ||
  setweight(to_tsvector('english', state_region), 'B') ||
  setweight(to_tsvector('english', city), 'B');
```

### Guides
```sql
search_vector :=
  setweight(to_tsvector('english', title), 'A') ||
  setweight(to_tsvector('english', excerpt), 'B') ||
  setweight(to_tsvector('english', content), 'C');
```

### Itineraries
```sql
search_vector :=
  setweight(to_tsvector('english', title), 'A') ||
  setweight(to_tsvector('english', description), 'B') ||
  setweight(to_tsvector('english', start_location), 'B') ||
  setweight(to_tsvector('english', end_location), 'B');
```

**Query Example:**
```sql
SELECT * FROM destinations
WHERE publication_status = 'published'
AND search_vector @@ websearch_to_tsquery('english', 'ladakh monastery trek')
ORDER BY ts_rank_cd(search_vector, websearch_to_tsquery('english', 'ladakh monastery trek')) DESC;
```

## Seed Data

The `seed.sql` migration includes:

- **10 countries**: India, Japan, Italy, Thailand, Australia, New Zealand, Iceland, Peru, Morocco, South Africa
- **8 experience categories**: Mountains & Trekking, Road Trips, Beaches & Islands, Nature & Wildlife, Culture & Heritage, Adventure, Photography, Food & Local Experiences
- **8 guide categories**: Destination Guides, Travel Tips, Budget Travel, Solo Travel, Family Travel, Photography Guides, Food Guides, Adventure Guides
- **4 destinations**: Ladakh, Spiti Valley, Uttarakhand (India), Kyoto (Japan) — all published with full details
- **Destination-category associations** for all 4 destinations
- **8 attractions** for Ladakh
- **16 gallery images** (4 per destination)

## Migrations

| File | Description |
|------|-------------|
| `001_core_schema.sql` | All tables, enums, indexes, triggers, full-text search |
| `002_rls_policies.sql` | RLS enable + all policies + helper functions |
| `seed.sql` | Reference data + 4 sample destinations |

## TypeScript Types

Generated types in `src/types/database.ts` include:
- `Row` types for each table (e.g., `DestinationsRow`)
- `Insert` types for creation (e.g., `DestinationsInsert`)
- `Update` types for updates (e.g., `DestinationsUpdate`)
- Composite types with relations (e.g., `DestinationWithCategories`)
- API response types (e.g., `PaginatedResponse`, `SearchResult`)

Regenerate with:
```bash
npx supabase gen types typescript --local > src/types/database.ts
```

## Data Access Layer

Located in `src/services/`:
- `destinations.ts` - Destination queries (published, featured, search, CRUD)
- Additional services to be added: `guides.ts`, `itineraries.ts`, `trips.ts`, `auth.ts`

All functions use the **server client** (`@supabase/ssr`) for Server Components and Server Actions.

## Supabase Client Helpers

Located in `src/lib/supabase/`:
- `browser.ts` - `createBrowserClient()` for Client Components
- `server.ts` - `createServerClient()` for Server Components/Actions
- `admin.ts` - `createAdminClient()` for admin operations (service role key)

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-only!
```

## Local Development

```bash
# Start Supabase locally
npx supabase start

# Run migrations
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > src/types/database.ts

# Open Studio
npx supabase studio
```

## Production Deployment

1. Push migrations: `npx supabase db push`
2. Set environment variables in Vercel/hosting
3. Enable RLS on all tables (already done via migrations)
4. Configure auth providers in Supabase dashboard
5. Set up storage buckets for images/media