import { Hero, TripPlannerPromo } from "@/components/destination/Hero";
import { ExperienceCategoriesGrid } from "@/components/destination/ExperienceCategory";
import { FeaturedStoriesGrid } from "@/components/destination/StoryCard";
import { NewsletterSection } from "@/components/forms/NewsletterForm";
import { Section, SectionHeader } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { FeaturedDestinationsSection } from "@/components/destination/FeaturedDestinationsSection";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <Section size="lg">
        <Container>
          <SectionHeader
            title="Featured Destinations"
            subtitle="Handpicked destinations that capture the spirit of exploration"
            align="center"
          />
          <Suspense fallback={<div className="h-80 flex items-center justify-center"><p className="font-body text-body-md text-muted-foreground">Loading featured destinations...</p></div>}>
            <FeaturedDestinationsSection />
          </Suspense>
          <div className="text-center mt-10">
            <a
              href="/destinations"
              className="inline-flex items-center gap-2 font-nav text-body-md text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-3 py-2"
            >
              View All Destinations
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </Container>
      </Section>

      <Section size="lg">
        <Container>
          <SectionHeader
            title="Explore by Experience"
            subtitle="Find your perfect journey by the type of adventure you crave"
            align="center"
          />
          <ExperienceCategoriesGrid />
        </Container>
      </Section>

      <Section size="lg" className="bg-deep-pine/20">
        <Container>
          <SectionHeader
            title="Featured Travel Stories"
            subtitle="Authentic journeys, stunning photography, and hard-won wisdom from fellow travellers"
            align="center"
          />
          <FeaturedStoriesGrid />
          <div className="text-center mt-10">
            <a
              href="/stories"
              className="inline-flex items-center gap-2 font-nav text-body-md text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-3 py-2"
            >
              Read All Stories
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </Container>
      </Section>

      <TripPlannerPromo />

      <NewsletterSection />
    </>
  );
}