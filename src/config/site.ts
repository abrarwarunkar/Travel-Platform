import { Suspense } from "react";
import type { ReactNode } from "react";

export const SITE_CONFIG = {
  brand: "NOMORA",
  tagline: "Discover beyond the familiar.",
  url: "https://example.com",
  title: "NOMORA - Travel Discovery & Planning Platform",
  description: "Discover extraordinary destinations, find stories worth travelling for and plan journeys that stay with you.",
  defaultCurrency: "INR",
  defaultLocale: "en",
} as const;

export const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Destinations", href: "/destinations" },
  { label: "Travel Guides", href: "/guides" },
  { label: "Itineraries", href: "/itineraries" },
  { label: "Plan a Trip", href: "/trip-planner" },
  { label: "Stories", href: "/stories" },
  { label: "About", href: "/about" },
] as const;

export const ADDITIONAL_NAVIGATION = [
  { label: "Search", href: "/search" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Saved Destinations", href: "/saved-destinations" },
  { label: "User Profile", href: "/profile" },
] as const;

export const FOOTER_NAVIGATION = [
  { label: "About", href: "/about" },
  { label: "Explore", href: "/explore" },
  { label: "Destinations", href: "/destinations" },
  { label: "Travel Guides", href: "/guides" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
] as const;

export const EXPERIENCE_CATEGORIES = [
  "Mountains and Trekking",
  "Road Trips",
  "Beaches and Islands",
  "Nature and Wildlife",
  "Culture and Heritage",
  "Adventure",
  "Photography",
  "Food and Local Experiences",
] as const;

export const FEATURED_DESTINATIONS = [
  { name: "Ladakh", country: "India", slug: "ladakh" },
  { name: "Spiti Valley", country: "India", slug: "spiti-valley" },
  { name: "Uttarakhand", country: "India", slug: "uttarakhand" },
  { name: "Rajasthan", country: "India", slug: "rajasthan" },
  { name: "Kashmir", country: "India", slug: "kashmir" },
  { name: "Kerala", country: "India", slug: "kerala" },
] as const;