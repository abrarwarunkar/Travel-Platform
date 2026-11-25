-- Phase 2: Core Database Schema
-- Travel Discovery & Planning Platform
-- Country-agnostic schema with UUID PKs, timestamps, FKs, indexes, full-text search

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE publication_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('super_admin', 'content_editor', 'moderator', 'contributor', 'user');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to auto-update search_vector for destinations
CREATE OR REPLACE FUNCTION update_destinations_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.detailed_description, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.state_region, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to auto-update search_vector for guides
CREATE OR REPLACE FUNCTION update_guides_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to auto-update search_vector for itineraries
CREATE OR REPLACE FUNCTION update_itineraries_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.start_location, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.end_location, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TABLES
-- ============================================

-- Countries (reference data)
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    iso_code CHAR(2) NOT NULL UNIQUE,
    currency_code CHAR(3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    home_country UUID REFERENCES countries(id) ON DELETE SET NULL,
    travel_interests TEXT[],
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, username)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'username'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Categories (travel experience categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Destinations (core content)
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    state_region TEXT,
    city TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    short_description TEXT,
    detailed_description TEXT,
    hero_image TEXT,
    gallery_images TEXT[],
    best_seasons TEXT[],
    avg_duration_days INTEGER,
    budget_guidance TEXT,
    travel_difficulty TEXT,
    publication_status publication_status NOT NULL DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    last_verified DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector TSVECTOR
);

-- Unique constraint on slug per country
CREATE UNIQUE INDEX destinations_country_slug_unique ON destinations(country_id, slug);

-- Indexes for destinations
CREATE INDEX destinations_country_id_idx ON destinations(country_id);
CREATE INDEX destinations_publication_status_idx ON destinations(publication_status);
CREATE INDEX destinations_slug_idx ON destinations(slug);
CREATE INDEX destinations_search_vector_idx ON destinations USING GIN(search_vector);
CREATE INDEX destinations_last_verified_idx ON destinations(last_verified);

-- Trigger to update updated_at
CREATE TRIGGER update_destinations_updated_at
    BEFORE UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update search_vector
CREATE TRIGGER update_destinations_search_vector_trigger
    BEFORE INSERT OR UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_destinations_search_vector();

-- Destination images (gallery)
CREATE TABLE destination_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX destination_images_destination_id_idx ON destination_images(destination_id);

-- Attractions (points of interest)
CREATE TABLE attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX attractions_destination_slug_unique ON attractions(destination_id, slug);
CREATE INDEX attractions_destination_id_idx ON attractions(destination_id);

-- Destination categories (many-to-many)
CREATE TABLE destination_categories (
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (destination_id, category_id)
);

-- Guides (travel articles)
CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES guide_categories(id) ON DELETE SET NULL,
    publication_status publication_status NOT NULL DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    last_verified DATE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector TSVECTOR
);

CREATE INDEX guides_author_id_idx ON guides(author_id);
CREATE INDEX guides_category_id_idx ON guides(category_id);
CREATE INDEX guides_publication_status_idx ON guides(publication_status);
CREATE INDEX guides_slug_idx ON guides(slug);
CREATE INDEX guides_search_vector_idx ON guides USING GIN(search_vector);
CREATE INDEX guides_published_at_idx ON guides(published_at);

CREATE TRIGGER update_guides_updated_at
    BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_search_vector_trigger
    BEFORE INSERT OR UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_guides_search_vector();

-- Guide categories
CREATE TABLE guide_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Itineraries
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
    duration_days INTEGER NOT NULL,
    start_location TEXT,
    end_location TEXT,
    travel_mode TEXT,
    estimated_budget DECIMAL(12, 2),
    budget_currency CHAR(3) DEFAULT 'INR',
    recommended_season TEXT,
    description TEXT,
    publication_status publication_status NOT NULL DEFAULT 'draft',
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    last_verified DATE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector TSVECTOR
);

CREATE INDEX itineraries_destination_id_idx ON itineraries(destination_id);
CREATE INDEX itineraries_author_id_idx ON itineraries(author_id);
CREATE INDEX itineraries_publication_status_idx ON itineraries(publication_status);
CREATE INDEX itineraries_slug_idx ON itineraries(slug);
CREATE INDEX itineraries_search_vector_idx ON itineraries USING GIN(search_vector);
CREATE INDEX itineraries_published_at_idx ON itineraries(published_at);

CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON itineraries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_search_vector_trigger
    BEFORE INSERT OR UPDATE ON itineraries
    FOR EACH ROW EXECUTE FUNCTION update_itineraries_search_vector();

-- Itinerary days
CREATE TABLE itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT,
    description TEXT,
    start_point TEXT,
    end_point TEXT,
    distance_km DECIMAL(8, 2),
    duration_hours DECIMAL(5, 2),
    accommodation_area TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX itinerary_days_itinerary_day_unique ON itinerary_days(itinerary_id, day_number);
CREATE INDEX itinerary_days_itinerary_id_idx ON itinerary_days(itinerary_id);

-- Itinerary stops
CREATE TABLE itinerary_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    stop_type TEXT,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX itinerary_stops_itinerary_day_id_idx ON itinerary_stops(itinerary_day_id);

-- Trips (user-created)
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    budget_estimate DECIMAL(12, 2),
    budget_currency CHAR(3) DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'planning',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX trips_user_id_idx ON trips(user_id);
CREATE INDEX trips_destination_id_idx ON trips(destination_id);
CREATE INDEX trips_status_idx ON trips(status);

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trip members (shared trips)
CREATE TABLE trip_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX trip_members_trip_user_unique ON trip_members(trip_id, user_id);
CREATE INDEX trip_members_trip_id_idx ON trip_members(trip_id);
CREATE INDEX trip_members_user_id_idx ON trip_members(user_id);

-- Saved destinations (bookmarks)
CREATE TABLE saved_destinations (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, destination_id)
);

-- Saved itineraries
CREATE TABLE saved_itineraries (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, itinerary_id)
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reviews_user_id_idx ON reviews(user_id);
CREATE INDEX reviews_destination_id_idx ON reviews(destination_id);
CREATE INDEX reviews_status_idx ON reviews(status);

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('guide', 'itinerary', 'community_post')),
    parent_id UUID NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX comments_user_id_idx ON comments(user_id);
CREATE INDEX comments_parent_idx ON comments(parent_type, parent_id);
CREATE INDEX comments_status_idx ON comments(status);

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Community posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    media_ids UUID[],
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX community_posts_status_idx ON community_posts(status);

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Media (uploaded files)
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX media_user_id_idx ON media(user_id);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    interests TEXT[],
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX newsletter_subscribers_email_idx ON newsletter_subscribers(email);
CREATE INDEX newsletter_subscribers_status_idx ON newsletter_subscribers(status);

-- Content sources (provenance tracking)
CREATE TABLE content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    source_url TEXT NOT NULL,
    source_title TEXT,
    verified_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX content_sources_record_idx ON content_sources(table_name, record_id);

-- Reports (moderation)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('guide', 'itinerary', 'community_post', 'comment', 'review', 'profile')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reports_reporter_id_idx ON reports(reporter_id);
CREATE INDEX reports_target_idx ON reports(target_type, target_id);
CREATE INDEX reports_status_idx ON reports(status);