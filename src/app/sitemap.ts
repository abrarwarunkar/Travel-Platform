import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

const STATIC_ROUTES = [
  "",
  "/explore",
  "/destinations",
  "/guides",
  "/itineraries",
  "/trip-planner",
  "/stories",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/login",
  "/register",
  "/search",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...STATIC_ROUTES.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  ];
}