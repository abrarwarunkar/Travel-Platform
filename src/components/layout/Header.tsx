"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAVIGATION, ADDITIONAL_NAVIGATION } from "@/config/site";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
        role="banner"
      >
        <nav className="container-padded" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="font-display text-heading-md text-foreground hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                aria-label="NOMORA - Home"
              >
                NOMORA
              </Link>

              <div className="hidden md:flex md:items-center md:gap-6" role="navigation" aria-label="Primary">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-nav text-body-sm text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm px-2 py-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex md:items-center md:gap-3" role="navigation" aria-label="Secondary">
                {ADDITIONAL_NAVIGATION.slice(0, 2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-nav text-body-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm px-2 py-1"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>

              <button
                type="button"
                className="md:hidden p-2 rounded-md text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 border-t border-border bg-background [transition-timing-function:var(--ease-spring)]",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container-padded py-4 space-y-4">
            <div className="flex flex-col space-y-2" role="list" aria-label="Primary navigation">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="font-nav text-body-md text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  role="listitem"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex flex-col space-y-2" role="list" aria-label="Secondary navigation">
              {ADDITIONAL_NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="font-nav text-body-md text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  role="listitem"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex flex-col space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/login" onClick={closeMobileMenu}>Login</Link>
              </Button>
              <Button variant="primary" className="w-full justify-start" asChild>
                <Link href="/register" onClick={closeMobileMenu}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-16 md:h-16" aria-hidden="true" />
    </>
  );
}