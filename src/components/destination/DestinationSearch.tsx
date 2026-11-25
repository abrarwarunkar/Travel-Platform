"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

const SEARCH_CATEGORIES = [
  "Destination name",
  "Country",
  "City",
  "Region",
  "Travel experience",
];

export function DestinationSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(SEARCH_CATEGORIES[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Search:", { query: query.trim(), category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto" role="search" aria-label="Destination search">
      <div className="relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg border border-border" aria-hidden="true" />
        <div className="relative flex flex-col sm:flex-row gap-3 p-3">
          <div className="relative flex-1">
            <label htmlFor="destination-search" className="sr-only">
              Search destinations
            </label>
            <input
              id="destination-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, countries, experiences..."
              className="w-full h-12 bg-transparent text-foreground placeholder:text-muted-foreground text-body-md px-4 focus-visible:outline-none"
              autoComplete="off"
              aria-describedby="search-hint"
            />
          </div>
          <div className="relative">
            <label htmlFor="search-category" className="sr-only">
              Search category
            </label>
            <select
              id="search-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 bg-secondary/50 text-foreground text-body-sm px-4 pr-10 rounded-md border border-border appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
              aria-label="Search category"
            >
              {SEARCH_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <Button type="submit" variant="primary" size="lg" className="whitespace-nowrap" aria-label="Search">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </Button>
        </div>
      </div>
      <p id="search-hint" className="sr-only">
        Enter a destination name, country, city, region, or travel experience to search
      </p>
    </form>
  );
}

export function SearchCTA() {
  return (
    <div className="text-center mt-8">
      <p className="font-body text-body-md text-muted-foreground mb-4">
        Or explore by
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {["Ladakh", "Spiti Valley", "Rajasthan", "Kerala", "Kashmir", "Uttarakhand"].map((dest) => (
          <Button
            key={dest}
            variant="ghost"
            size="sm"
            className="text-body-sm"
            onClick={() => console.log("Quick search:", dest)}
          >
            {dest}
          </Button>
        ))}
      </div>
    </div>
  );
}