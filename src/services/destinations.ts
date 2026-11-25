/**
 * Phase 2: Data Access Layer - Destinations
 * Typed Supabase queries for destination-related operations
 */

import { createClient } from "@/lib/supabase/server";
import type {
  DestinationsRow,
  DestinationsInsert,
  DestinationsUpdate,
  DestinationWithCategories,
  CategoriesRow,
  CountriesRow,
  DestinationImagesRow,
  AttractionsRow,
  PaginatedResponse,
  DestinationSearchParams,
} from "@/types/database";

/**
 * Fetch published destinations with pagination and filtering
 */
export async function getPublishedDestinations(
  params: DestinationSearchParams = {}
): Promise<PaginatedResponse<DestinationsRow>> {
  const supabase = await createClient();
  const {
    query,
    country,
    category,
    season,
    difficulty,
    minDuration,
    maxDuration,
    minBudget,
    maxBudget,
    page = 1,
    pageSize = 12,
    sortBy = "relevance",
    sortOrder = "desc",
  } = params;

  let queryBuilder = supabase
    .from("destinations")
    .select("*", { count: "exact" })
    .eq("publication_status", "published");

  // Text search using full-text search
  if (query) {
    queryBuilder = queryBuilder.textSearch("search_vector", query, {
      type: "websearch",
      config: "english",
    });
  }

  // Filter by country
  if (country) {
    queryBuilder = queryBuilder.eq("countries.slug", country);
  }

  // Filter by category (requires join)
  if (category) {
    queryBuilder = queryBuilder.contains("categories", [{ slug: category }]);
  }

  // Filter by season
  if (season) {
    queryBuilder = queryBuilder.contains("best_seasons", [season]);
  }

  // Filter by difficulty
  if (difficulty) {
    queryBuilder = queryBuilder.ilike("travel_difficulty", `%${difficulty}%`);
  }

  // Filter by duration
  if (minDuration) {
    queryBuilder = queryBuilder.gte("avg_duration_days", minDuration);
  }
  if (maxDuration) {
    queryBuilder = queryBuilder.lte("avg_duration_days", maxDuration);
  }

  // Sorting
  const sortColumn = sortBy === "relevance" && query ? "search_vector" : sortBy;
  queryBuilder = queryBuilder.order(sortColumn, { ascending: sortOrder === "asc" });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  queryBuilder = queryBuilder.range(from, to);

  const { data, error, count } = await queryBuilder;

  if (error) {
    console.error("Error fetching destinations:", error);
    throw new Error(`Failed to fetch destinations: ${error.message}`);
  }

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Fetch a single destination by slug with all related data
 */
export async function getDestinationBySlug(
  slug: string,
  countrySlug?: string
): Promise<DestinationWithCategories | null> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("destinations")
    .select(
      `
      *,
      country:countries(*),
      categories:destination_categories(category:categories(*)),
      images:destination_images(*),
      attractions(*)
    `
    )
    .eq("slug", slug)
    .eq("publication_status", "published");

  if (countrySlug) {
    queryBuilder = queryBuilder.eq("country.slug", countrySlug);
  }

  const { data, error } = await queryBuilder.single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching destination:", error);
    throw new Error(`Failed to fetch destination: ${error.message}`);
  }

  if (!data) return null;

  // Transform categories from nested structure
  const categories = data.categories?.map((c: { category: CategoriesRow }) => c.category) || [];

  return {
    ...data,
    categories,
    country: data.country,
    images: data.images || [],
    attractions: data.attractions || [],
  };
}

/**
 * Fetch featured destinations for homepage
 */
export async function getFeaturedDestinations(
  limit: number = 6
): Promise<Array<DestinationsRow & { country: CountriesRow }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .select(`
      *,
      country:countries(*)
    `)
    .eq("publication_status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured destinations:", error);
    throw new Error(`Failed to fetch featured destinations: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch destinations by category slug
 */
export async function getDestinationsByCategory(
  categorySlug: string,
  limit: number = 12
): Promise<DestinationsRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("publication_status", "published")
    .contains("categories", [{ slug: categorySlug }])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching destinations by category:", error);
    throw new Error(`Failed to fetch destinations by category: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch all published categories with destination counts
 */
export async function getCategoriesWithCounts(): Promise<
  (CategoriesRow & { destination_count: number })[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      destination_categories(destination_id)
    `
    )
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return (data || []).map((cat) => ({
    ...cat,
    destination_count: cat.destination_categories?.length || 0,
  }));
}

/**
 * Fetch all countries with published destination counts
 */
export async function getCountriesWithCounts(): Promise<
  (CountriesRow & { destination_count: number })[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select(
      `
      *,
      destinations!inner(count)
    `
    )
    .eq("destinations.publication_status", "published")
    .order("name");

  if (error) {
    console.error("Error fetching countries:", error);
    throw new Error(`Failed to fetch countries: ${error.message}`);
  }

  return (data || []).map((country) => ({
    ...country,
    destination_count: country.destinations?.[0]?.count || 0,
  }));
}

/**
 * Search destinations using full-text search
 */
export async function searchDestinations(
  searchQuery: string,
  limit: number = 10
): Promise<DestinationsRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("publication_status", "published")
    .textSearch("search_vector", searchQuery, {
      type: "websearch",
      config: "english",
    })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error searching destinations:", error);
    throw new Error(`Failed to search destinations: ${error.message}`);
  }

  return data || [];
}

/**
 * Get destination suggestions for autocomplete
 */
export async function getDestinationSuggestions(
  query: string,
  limit: number = 5
): Promise<Pick<DestinationsRow, "id" | "name" | "slug" | "state_region" | "country_id">[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .select("id, name, slug, state_region, country_id")
    .eq("publication_status", "published")
    .ilike("name", `%${query}%`)
    .limit(limit);

  if (error) {
    console.error("Error fetching destination suggestions:", error);
    throw new Error(`Failed to fetch destination suggestions: ${error.message}`);
  }

  return data || [];
}

/**
 * Get related destinations (same country or categories)
 */
export async function getRelatedDestinations(
  destinationId: string,
  limit: number = 4
): Promise<DestinationsRow[]> {
  const supabase = await createClient();

  // First get the destination's country and categories
  const { data: destination } = await supabase
    .from("destinations")
    .select("country_id, categories:destination_categories(category_id)")
    .eq("id", destinationId)
    .single();

  if (!destination) return [];

  const countryId = destination.country_id;
  const categoryIds = destination.categories?.map((c: { category_id: string }) => c.category_id) || [];

  // Find related destinations
  let queryBuilder = supabase
    .from("destinations")
    .select("*")
    .eq("publication_status", "published")
    .neq("id", destinationId);

  if (categoryIds.length > 0) {
    queryBuilder = queryBuilder.contains(
      "categories",
      categoryIds.map((id) => ({ id }))
    );
  } else {
    queryBuilder = queryBuilder.eq("country_id", countryId);
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(limit);

  if (error) {
    console.error("Error fetching related destinations:", error);
    return [];
  }

  return data || [];
}

/**
 * Create a new destination (admin/editor only)
 */
export async function createDestination(
  destination: DestinationsInsert
): Promise<DestinationsRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .insert(destination)
    .select()
    .single();

  if (error) {
    console.error("Error creating destination:", error);
    throw new Error(`Failed to create destination: ${error.message}`);
  }

  return data;
}

/**
 * Update a destination (admin/editor only)
 */
export async function updateDestination(
  id: string,
  updates: DestinationsUpdate
): Promise<DestinationsRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating destination:", error);
    throw new Error(`Failed to update destination: ${error.message}`);
  }

  return data;
}

/**
 * Delete a destination (admin only)
 */
export async function deleteDestination(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("destinations").delete().eq("id", id);

  if (error) {
    console.error("Error deleting destination:", error);
    throw new Error(`Failed to delete destination: ${error.message}`);
  }

  return true;
}

/**
 * Associate categories with a destination
 */
export async function setDestinationCategories(
  destinationId: string,
  categoryIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // Remove existing associations
  await supabase
    .from("destination_categories")
    .delete()
    .eq("destination_id", destinationId);

  // Add new associations
  if (categoryIds.length > 0) {
    const associations = categoryIds.map((categoryId) => ({
      destination_id: destinationId,
      category_id: categoryId,
    }));

    const { error } = await supabase
      .from("destination_categories")
      .insert(associations);

    if (error) {
      console.error("Error setting destination categories:", error);
      throw new Error(`Failed to set destination categories: ${error.message}`);
    }
  }
}

/**
 * Add images to a destination gallery
 */
export async function addDestinationImages(
  destinationId: string,
  images: Array<{ url: string; alt_text?: string; sort_order?: number }>
): Promise<DestinationImagesRow[]> {
  const supabase = await createClient();

  const imagesToInsert = images.map((img, index) => ({
    destination_id: destinationId,
    url: img.url,
    alt_text: img.alt_text,
    sort_order: img.sort_order ?? index,
  }));

  const { data, error } = await supabase
    .from("destination_images")
    .insert(imagesToInsert)
    .select();

  if (error) {
    console.error("Error adding destination images:", error);
    throw new Error(`Failed to add destination images: ${error.message}`);
  }

  return data || [];
}