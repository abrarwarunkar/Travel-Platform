/**
 * Phase 2: Database Types
 * Auto-generated types from Supabase schema
 * Run `npx supabase gen types typescript --local > src/types/database.ts` to regenerate
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PublicationStatus = "draft" | "published" | "archived";
export type UserRole = "super_admin" | "content_editor" | "moderator" | "contributor" | "user";

export interface CountriesRow {
  id: string;
  name: string;
  slug: string;
  iso_code: string;
  currency_code: string | null;
  created_at: string;
}

export interface CountriesInsert {
  id?: string;
  name: string;
  slug: string;
  iso_code: string;
  currency_code?: string | null;
  created_at?: string;
}

export interface CountriesUpdate {
  id?: string;
  name?: string;
  slug?: string;
  iso_code?: string;
  currency_code?: string | null;
  created_at?: string;
}

export interface ProfilesRow {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_country: string | null;
  travel_interests: string[] | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ProfilesInsert {
  id: string;
  display_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  home_country?: string | null;
  travel_interests?: string[] | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface ProfilesUpdate {
  id?: string;
  display_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  home_country?: string | null;
  travel_interests?: string[] | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriesRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface CategoriesInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  created_at?: string;
}

export interface CategoriesUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
  created_at?: string;
}

export interface DestinationsRow {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  state_region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  short_description: string | null;
  detailed_description: string | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  best_seasons: string[] | null;
  avg_duration_days: number | null;
  budget_guidance: string | null;
  travel_difficulty: string | null;
  publication_status: PublicationStatus;
  seo_title: string | null;
  seo_description: string | null;
  last_verified: string | null;
  created_at: string;
  updated_at: string;
  search_vector: unknown | null;
}

export interface DestinationsInsert {
  id?: string;
  country_id: string;
  name: string;
  slug: string;
  state_region?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  short_description?: string | null;
  detailed_description?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  best_seasons?: string[] | null;
  avg_duration_days?: number | null;
  budget_guidance?: string | null;
  travel_difficulty?: string | null;
  publication_status?: PublicationStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  last_verified?: string | null;
  created_at?: string;
  updated_at?: string;
  search_vector?: unknown | null;
}

export interface DestinationsUpdate {
  id?: string;
  country_id?: string;
  name?: string;
  slug?: string;
  state_region?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  short_description?: string | null;
  detailed_description?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  best_seasons?: string[] | null;
  avg_duration_days?: number | null;
  budget_guidance?: string | null;
  travel_difficulty?: string | null;
  publication_status?: PublicationStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  last_verified?: string | null;
  created_at?: string;
  updated_at?: string;
  search_vector?: unknown | null;
}

export interface DestinationImagesRow {
  id: string;
  destination_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface DestinationImagesInsert {
  id?: string;
  destination_id: string;
  url: string;
  alt_text?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface DestinationImagesUpdate {
  id?: string;
  destination_id?: string;
  url?: string;
  alt_text?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface AttractionsRow {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  created_at: string;
}

export interface AttractionsInsert {
  id?: string;
  destination_id: string;
  name: string;
  slug: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  category?: string | null;
  created_at?: string;
}

export interface AttractionsUpdate {
  id?: string;
  destination_id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  category?: string | null;
  created_at?: string;
}

export interface DestinationCategoriesRow {
  destination_id: string;
  category_id: string;
}

export interface DestinationCategoriesInsert {
  destination_id: string;
  category_id: string;
}

export interface DestinationCategoriesUpdate {
  destination_id?: string;
  category_id?: string;
}

export interface GuidesRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: string;
  category_id: string | null;
  publication_status: PublicationStatus;
  seo_title: string | null;
  seo_description: string | null;
  last_verified: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  search_vector: unknown | null;
}

export interface GuidesInsert {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  author_id: string;
  category_id?: string | null;
  publication_status?: PublicationStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  last_verified?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  search_vector?: unknown | null;
}

export interface GuidesUpdate {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  author_id?: string;
  category_id?: string | null;
  publication_status?: PublicationStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  last_verified?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  search_vector?: unknown | null;
}

export interface GuideCategoriesRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface GuideCategoriesInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
}

export interface GuideCategoriesUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  created_at?: string;
}

export interface ItinerariesRow {
  id: string;
  title: string;
  slug: string;
  destination_id: string;
  duration_days: number;
  start_location: string | null;
  end_location: string | null;
  travel_mode: string | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  recommended_season: string | null;
  description: string | null;
  publication_status: PublicationStatus;
  author_id: string;
  last_verified: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  search_vector: unknown | null;
}

export interface ItinerariesInsert {
  id?: string;
  title: string;
  slug: string;
  destination_id: string;
  duration_days: number;
  start_location?: string | null;
  end_location?: string | null;
  travel_mode?: string | null;
  estimated_budget?: number | null;
  budget_currency?: string | null;
  recommended_season?: string | null;
  description?: string | null;
  publication_status?: PublicationStatus;
  author_id: string;
  last_verified?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  search_vector?: unknown | null;
}

export interface ItinerariesUpdate {
  id?: string;
  title?: string;
  slug?: string;
  destination_id?: string;
  duration_days?: number;
  start_location?: string | null;
  end_location?: string | null;
  travel_mode?: string | null;
  estimated_budget?: number | null;
  budget_currency?: string | null;
  recommended_season?: string | null;
  description?: string | null;
  publication_status?: PublicationStatus;
  author_id?: string;
  last_verified?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  search_vector?: unknown | null;
}

export interface ItineraryDaysRow {
  id: string;
  itinerary_id: string;
  day_number: number;
  title: string | null;
  description: string | null;
  start_point: string | null;
  end_point: string | null;
  distance_km: number | null;
  duration_hours: number | null;
  accommodation_area: string | null;
  notes: string | null;
  created_at: string;
}

export interface ItineraryDaysInsert {
  id?: string;
  itinerary_id: string;
  day_number: number;
  title?: string | null;
  description?: string | null;
  start_point?: string | null;
  end_point?: string | null;
  distance_km?: number | null;
  duration_hours?: number | null;
  accommodation_area?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface ItineraryDaysUpdate {
  id?: string;
  itinerary_id?: string;
  day_number?: number;
  title?: string | null;
  description?: string | null;
  start_point?: string | null;
  end_point?: string | null;
  distance_km?: number | null;
  duration_hours?: number | null;
  accommodation_area?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface ItineraryStopsRow {
  id: string;
  itinerary_day_id: string;
  stop_order: number;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  stop_type: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface ItineraryStopsInsert {
  id?: string;
  itinerary_day_id: string;
  stop_order: number;
  name: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  stop_type?: string | null;
  duration_minutes?: number | null;
  created_at?: string;
}

export interface ItineraryStopsUpdate {
  id?: string;
  itinerary_day_id?: string;
  stop_order?: number;
  name?: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  stop_type?: string | null;
  duration_minutes?: number | null;
  created_at?: string;
}

export interface TripsRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  destination_id: string | null;
  start_date: string | null;
  end_date: string | null;
  budget_estimate: number | null;
  budget_currency: string | null;
  status: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripsInsert {
  id?: string;
  user_id: string;
  title: string;
  description?: string | null;
  destination_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget_estimate?: number | null;
  budget_currency?: string | null;
  status?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TripsUpdate {
  id?: string;
  user_id?: string;
  title?: string;
  description?: string | null;
  destination_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget_estimate?: number | null;
  budget_currency?: string | null;
  status?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TripMembersRow {
  id: string;
  trip_id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface TripMembersInsert {
  id?: string;
  trip_id: string;
  user_id: string;
  role?: string;
  created_at?: string;
}

export interface TripMembersUpdate {
  id?: string;
  trip_id?: string;
  user_id?: string;
  role?: string;
  created_at?: string;
}

export interface SavedDestinationsRow {
  user_id: string;
  destination_id: string;
  created_at: string;
}

export interface SavedDestinationsInsert {
  user_id: string;
  destination_id: string;
  created_at?: string;
}

export interface SavedDestinationsUpdate {
  user_id?: string;
  destination_id?: string;
  created_at?: string;
}

export interface SavedItinerariesRow {
  user_id: string;
  itinerary_id: string;
  created_at: string;
}

export interface SavedItinerariesInsert {
  user_id: string;
  itinerary_id: string;
  created_at?: string;
}

export interface SavedItinerariesUpdate {
  user_id?: string;
  itinerary_id?: string;
  created_at?: string;
}

export interface ReviewsRow {
  id: string;
  user_id: string;
  destination_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewsInsert {
  id?: string;
  user_id: string;
  destination_id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewsUpdate {
  id?: string;
  user_id?: string;
  destination_id?: string;
  rating?: number;
  title?: string | null;
  content?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommentsRow {
  id: string;
  user_id: string;
  parent_type: "guide" | "itinerary" | "community_post";
  parent_id: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CommentsInsert {
  id?: string;
  user_id: string;
  parent_type: "guide" | "itinerary" | "community_post";
  parent_id: string;
  content: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommentsUpdate {
  id?: string;
  user_id?: string;
  parent_type?: "guide" | "itinerary" | "community_post";
  parent_id?: string;
  content?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommunityPostsRow {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  media_ids: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityPostsInsert {
  id?: string;
  user_id: string;
  title: string;
  content?: string | null;
  media_ids?: string[] | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommunityPostsUpdate {
  id?: string;
  user_id?: string;
  title?: string;
  content?: string | null;
  media_ids?: string[] | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaRow {
  id: string;
  user_id: string;
  url: string;
  type: string;
  alt_text: string | null;
  created_at: string;
}

export interface MediaInsert {
  id?: string;
  user_id: string;
  url: string;
  type: string;
  alt_text?: string | null;
  created_at?: string;
}

export interface MediaUpdate {
  id?: string;
  user_id?: string;
  url?: string;
  type?: string;
  alt_text?: string | null;
  created_at?: string;
}

export interface NewsletterSubscribersRow {
  id: string;
  email: string;
  interests: string[] | null;
  consent: boolean;
  status: string;
  created_at: string;
}

export interface NewsletterSubscribersInsert {
  id?: string;
  email: string;
  interests?: string[] | null;
  consent?: boolean;
  status?: string;
  created_at?: string;
}

export interface NewsletterSubscribersUpdate {
  id?: string;
  email?: string;
  interests?: string[] | null;
  consent?: boolean;
  status?: string;
  created_at?: string;
}

export interface ContentSourcesRow {
  id: string;
  table_name: string;
  record_id: string;
  source_url: string;
  source_title: string | null;
  verified_date: string | null;
  created_at: string;
}

export interface ContentSourcesInsert {
  id?: string;
  table_name: string;
  record_id: string;
  source_url: string;
  source_title?: string | null;
  verified_date?: string | null;
  created_at?: string;
}

export interface ContentSourcesUpdate {
  id?: string;
  table_name?: string;
  record_id?: string;
  source_url?: string;
  source_title?: string | null;
  verified_date?: string | null;
  created_at?: string;
}

export interface ReportsRow {
  id: string;
  reporter_id: string;
  target_type: "guide" | "itinerary" | "community_post" | "comment" | "review" | "profile";
  target_id: string;
  reason: string;
  status: string;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface ReportsInsert {
  id?: string;
  reporter_id: string;
  target_type: "guide" | "itinerary" | "community_post" | "comment" | "review" | "profile";
  target_id: string;
  reason: string;
  status?: string;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at?: string;
}

export interface ReportsUpdate {
  id?: string;
  reporter_id?: string;
  target_type?: "guide" | "itinerary" | "community_post" | "comment" | "review" | "profile";
  target_id?: string;
  reason?: string;
  status?: string;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at?: string;
}

// ============================================
// COMPOSITE TYPES (with relations)
// ============================================

export interface DestinationWithCategories extends DestinationsRow {
  categories: CategoriesRow[];
  country: CountriesRow;
  images: DestinationImagesRow[];
  attractions: AttractionsRow[];
}

export interface GuideWithAuthor extends GuidesRow {
  author: ProfilesRow;
  category: GuideCategoriesRow | null;
}

export interface ItineraryWithDetails extends ItinerariesRow {
  destination: DestinationsRow;
  author: ProfilesRow;
  days: (ItineraryDaysRow & { stops: ItineraryStopsRow[] })[];
}

export interface TripWithMembers extends TripsRow {
  members: (TripMembersRow & { user: ProfilesRow })[];
  destination: DestinationsRow | null;
}

export interface ReviewWithUser extends ReviewsRow {
  user: ProfilesRow;
}

export interface CommentWithUser extends CommentsRow {
  user: ProfilesRow;
}

export interface CommunityPostWithUser extends CommunityPostsRow {
  user: ProfilesRow;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResult {
  id: string;
  type: "destination" | "guide" | "itinerary";
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  url: string;
}

export interface DestinationSearchParams {
  query?: string;
  country?: string;
  category?: string;
  season?: string;
  difficulty?: string;
  minDuration?: number;
  maxDuration?: number;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "relevance" | "name" | "duration" | "budget" | "popularity";
  sortOrder?: "asc" | "desc";
}