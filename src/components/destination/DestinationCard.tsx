"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface DestinationCardProps {
  name: string;
  country: string;
  slug: string;
  description: string;
  gradient?: string;
  heroImage?: string;
}

const DEFAULT_GRADIENTS = [
  "from-amber-900/50 via-orange-900/30 to-red-900/50",
  "from-emerald-900/50 via-teal-900/30 to-cyan-900/50",
  "from-blue-900/50 via-indigo-900/30 to-purple-900/50",
  "from-rose-900/50 via-pink-900/30 to-fuchsia-900/50",
  "from-amber-800/50 via-yellow-800/30 to-lime-800/50",
  "from-slate-800/50 via-gray-800/30 to-zinc-800/50",
];

export function DestinationCard({
  name,
  country,
  slug,
  description,
  gradient,
  heroImage,
}: DestinationCardProps) {
  const cardGradient = gradient || DEFAULT_GRADIENTS[Math.abs(name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % DEFAULT_GRADIENTS.length];

  return (
    <article className="group">
      <Link
        href={`/destinations/${slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        aria-label={`View ${name} travel guide`}
      >
        <div
          className={cn(
            "relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br",
            cardGradient,
            "transition-all duration-500 group-hover:scale-[1.02]"
          )}
          role="img"
          aria-label={`${name}, ${country} landscape`}
        >
          {heroImage && (
            <img
              src={heroImage}
              alt={`${name}, ${country}`}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute inset-0 flex items-end p-5">
            <div className="w-full">
              <div className="font-nav text-caption text-warm-bronze uppercase tracking-wider mb-1">
                {country.toUpperCase()}
              </div>
              <h3 className="font-display text-heading-lg text-foreground mb-1">{name}</h3>
              <p className="font-body text-body-sm text-stone/90 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-body-sm font-medium text-foreground border border-border">
              <svg className="h-4 w-4 text-warm-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Explore
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export interface FeaturedDestinationsGridProps {
  destinations: Array<{
    name: string;
    country: string;
    slug: string;
    description: string;
    hero_image?: string;
  }>;
}

export function FeaturedDestinationsGrid({ destinations }: FeaturedDestinationsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((dest, index) => (
        <DestinationCard
          key={dest.slug}
          name={dest.name}
          country={dest.country}
          slug={dest.slug}
          description={dest.description}
          gradient={DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]}
          heroImage={dest.hero_image}
        />
      ))}
    </div>
  );
}

// Fallback static data for when Supabase is unavailable
const FALLBACK_DESTINATIONS = [
  { name: "Ladakh", country: "India", slug: "ladakh", description: "High-altitude desert landscapes, ancient monasteries, and pristine lakes in the Himalayas." },
  { name: "Spiti Valley", country: "India", slug: "spiti-valley", description: "Remote cold desert valley with Buddhist monasteries, fossil-rich terrain, and star-filled skies." },
  { name: "Uttarakhand", country: "India", slug: "uttarakhand", description: "Land of gods with sacred rivers, hill stations, and gateway to Himalayan treks." },
  { name: "Rajasthan", country: "India", slug: "rajasthan", description: "Royal palaces, golden deserts, vibrant culture, and majestic forts across the Thar." },
  { name: "Kashmir", country: "India", slug: "kashmir", description: "Paradise on earth with alpine meadows, houseboats, saffron fields, and Mughal gardens." },
  { name: "Kerala", country: "India", slug: "kerala", description: "Backwaters, spice plantations, Ayurvedic wellness, and tropical beaches on the Malabar Coast." },
];

export function FeaturedDestinationsGridFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {FALLBACK_DESTINATIONS.map((dest, index) => (
        <DestinationCard
          key={dest.slug}
          {...dest}
          gradient={DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]}
        />
      ))}
    </div>
  );
}