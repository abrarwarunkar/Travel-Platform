"use client";

import { DestinationSearch, SearchCTA } from "@/components/destination/DestinationSearch";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-red-900/40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/30 to-background" aria-hidden="true" />

      <div className="relative container-padded">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border text-caption font-medium text-foreground mb-8" role="img" aria-label="New">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            New: AI Trip Planner now in beta
          </span>

          <h1
            id="hero-heading"
            className="font-display text-display-xl text-foreground mb-6 text-balance"
          >
            The world is too beautiful to stay in one place.
          </h1>

          <p className="font-body text-body-lg text-stone mb-10 max-w-2xl mx-auto text-balance">
            Discover extraordinary destinations, find stories worth travelling for and plan journeys that stay with you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="primary" size="lg" asChild>
              <a href="/trip-planner">Plan Your Next Adventure</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/destinations">Explore Destinations</a>
            </Button>
          </div>

          <div className="w-full">
            <DestinationSearch />
            <SearchCTA />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

export function TripPlannerPromo() {
  return (
    <section className="bg-deep-pine/30 border-y border-border py-16 sm:py-24" aria-labelledby="trip-planner-heading">
      <div className="container-padded">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-caption font-medium text-primary mb-4">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                New Feature
              </span>
              <h2 id="trip-planner-heading" className="font-display text-display-md text-foreground mb-6">
                Plan Smarter with AI
              </h2>
              <p className="font-body text-body-lg text-muted-foreground mb-8">
                Tell us where you want to go, how long you have, and what you love. Our AI trip planner creates a personalised day-by-day itinerary with budget estimates, transport options, and local insights — all grounded in verified destination data.
              </p>
              <ul className="space-y-3 mb-8" role="list">
                {[
                  "Personalised itineraries based on your travel style",
                  "Verified cost estimates (not fabricated prices)",
                  "Transport, accommodation & activity suggestions",
                  "Important travel considerations & warnings",
                  "Editable plans you can refine and share",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-body-md text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="lg" asChild>
                <a href="/trip-planner">Start Planning Your Trip</a>
              </Button>
            </div>

            <div className="relative">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800"
                role="img"
                aria-label="AI Trip Planner interface preview"
              >
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                      <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-display text-heading-lg text-foreground mb-3">Your Trip, Designed</h3>
                    <p className="font-body text-body-md text-muted-foreground">
                      Enter your preferences and watch your personalised itinerary come to life.
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}