"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Mountains & Trekking",
  "Road Trips",
  "Beaches & Islands",
  "Culture & Heritage",
  "Photography",
  "Food & Local Experiences",
  "Adventure Sports",
  "Budget Travel",
  "Luxury Travel",
  "Solo Travel",
  "Family Travel",
];

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    if (!consent) {
      setErrorMessage("Please consent to receive marketing emails");
      setStatus("error");
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Newsletter signup:", { email, interests: selectedInterests, consent });
    setStatus("success");
    setEmail("");
    setSelectedInterests([]);
    setConsent(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" noValidate>
      <div className="space-y-6">
        <div>
          <label htmlFor="newsletter-email" className="label">
            Email Address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            required
            aria-describedby="email-hint"
            disabled={status === "submitting" || status === "success"}
          />
          <p id="email-hint" className="sr-only">Enter your email address to subscribe</p>
        </div>

        <fieldset className="space-y-3">
          <legend className="label">Travel Interests (Optional)</legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Travel interests">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-body-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selectedInterests.includes(interest)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-foreground border-border hover:bg-secondary"
                )}
                aria-pressed={selectedInterests.includes(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="newsletter-consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            required
          />
          <label htmlFor="newsletter-consent" className="font-body text-body-sm text-muted-foreground leading-relaxed">
            I consent to receive marketing emails from{" "}
            <span className="font-medium text-foreground">NOMORA</span>{" "}
            with travel inspiration, destination guides, and special offers. I understand I can unsubscribe at any time.
            <br />
            <a href="/privacy-policy" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded">
              Privacy Policy
            </a>
          </label>
        </div>

        {status === "error" && (
          <div
            className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-body-sm"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}

        {status === "success" && (
          <div
            className="p-4 rounded-md bg-primary/10 border border-primary/20 text-primary text-body-sm"
            role="status"
            aria-live="polite"
          >
            Thanks for subscribing! Check your inbox for a confirmation email.
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Subscribing...
            </>
          ) : (
            "Subscribe to Newsletter"
          )}
        </Button>

        <p className="font-body text-caption text-muted-foreground text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-deep-pine/50 border-y border-border py-16 sm:py-24" aria-labelledby="newsletter-heading">
      <div className="container-padded">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="newsletter-heading" className="font-display text-display-sm text-foreground mb-4">
            Stay Inspired
          </h2>
          <p className="font-body text-body-lg text-muted-foreground">
            Get handpicked destination guides, travel stories, and planning tips delivered to your inbox.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}