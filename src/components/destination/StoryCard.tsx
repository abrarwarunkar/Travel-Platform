"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/common/Card";
import { formatDate, cn } from "@/lib/utils";

export interface StoryProps {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorSlug: string;
  publishedAt: string;
  readTime: number;
  category: string;
  gradient: string;
  imageUrl?: string;
}

const STORY_GRADIENTS = [
  "from-amber-900/60 via-orange-900/40 to-red-900/60",
  "from-emerald-900/60 via-teal-900/40 to-cyan-900/60",
  "from-blue-900/60 via-indigo-900/40 to-purple-900/60",
  "from-rose-900/60 via-pink-900/40 to-fuchsia-900/60",
  "from-amber-800/60 via-yellow-800/40 to-lime-800/60",
  "from-slate-800/60 via-gray-800/40 to-zinc-800/60",
];

export function StoryCard({ story }: { story: StoryProps }) {
  return (
    <article>
      <Link
        href={`/stories/${story.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Read story: ${story.title}`}
      >
        <Card variant="hover" className="h-full flex flex-col overflow-hidden">
          <div
            className={cn(
              "relative aspect-video rounded-t-lg overflow-hidden bg-gradient-to-br",
              story.gradient
            )}
            role="img"
            aria-label={`${story.title} cover image`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-caption font-medium text-foreground border border-border">
                {story.category}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-body text-caption text-stone/90 text-right">
                {story.readTime} min read
              </p>
            </div>
          </div>
          <CardContent className="flex flex-col flex-1 p-5">
            <div className="flex items-center gap-2 text-caption text-muted-foreground mb-3">
              <time dateTime={story.publishedAt}>{formatDate(story.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <Link
                href={`/author/${story.authorSlug}`}
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                onClick={(e) => e.stopPropagation()}
              >
                {story.author}
              </Link>
            </div>
            <h3 className="font-display text-heading-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {story.title}
            </h3>
            <p className="font-body text-body-sm text-muted-foreground line-clamp-3 flex-1">
              {story.excerpt}
            </p>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}

export function FeaturedStoriesGrid() {
  const stories: StoryProps[] = [
    {
      title: "Chasing Light in the Spiti Valley",
      slug: "chasing-light-spiti-valley",
      excerpt: "A photographer's journey through the cold desert, capturing monasteries perched on cliffs and skies unpolluted by city lights.",
      author: "Arjun Mehta",
      authorSlug: "arjun-mehta",
      publishedAt: "2026-10-15",
      readTime: 12,
      category: "Photography",
      gradient: STORY_GRADIENTS[0],
    },
    {
      title: "The Road to Pangong: A Ladakh Motorcycle Diary",
      slug: "road-to-pangong-ladakh-diary",
      excerpt: "Riding the world's highest motorable passes, crossing frozen streams, and finding silence at 14,000 feet.",
      author: "Priya Sharma",
      authorSlug: "priya-sharma",
      publishedAt: "2026-10-08",
      readTime: 15,
      category: "Road Trips",
      gradient: STORY_GRADIENTS[1],
    },
    {
      title: "Kerala's Hidden Backwaters Beyond Alleppey",
      slug: "kerala-hidden-backwaters",
      excerpt: "Exploring the lesser-known canals of Kuttanad, meeting toddy tappers, and staying in a century-old tharavadu.",
      author: "Meera Nair",
      authorSlug: "meera-nair",
      publishedAt: "2026-10-01",
      readTime: 10,
      category: "Culture and Heritage",
      gradient: STORY_GRADIENTS[2],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.slug} story={story} />
      ))}
    </div>
  );
}