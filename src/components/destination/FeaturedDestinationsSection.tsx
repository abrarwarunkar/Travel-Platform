import { FeaturedDestinationsGrid, FeaturedDestinationsGridFallback } from "./DestinationCard";
import { getFeaturedDestinations } from "@/services/destinations";

export async function FeaturedDestinationsSection() {
  let destinations: Array<{
    name: string;
    country: string;
    slug: string;
    description: string;
    hero_image?: string;
  }> = [];

  try {
    const data = await getFeaturedDestinations(6);
    destinations = data.map((d) => ({
      name: d.name,
      country: d.country?.name || "Unknown",
      slug: d.slug,
      description: d.short_description || "",
      hero_image: d.hero_image || undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch featured destinations, using fallback:", error);
  }

  // If we have data from Supabase, use it; otherwise fallback
  if (destinations.length > 0) {
    return <FeaturedDestinationsGrid destinations={destinations} />;
  }

  return <FeaturedDestinationsGridFallback />;
}