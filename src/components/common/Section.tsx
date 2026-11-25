"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg" | "xl";
  padded?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, size = "lg", padded = true, children, ...props }, ref) => {
    const sizes = {
      sm: "py-12 sm:py-16",
      md: "py-16 sm:py-20 lg:py-24",
      lg: "py-16 sm:py-24 lg:py-32",
      xl: "py-20 sm:py-28 lg:py-40",
    };

    return (
      <section
        ref={ref}
        className={cn(padded ? sizes[size] : "", className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export const SectionHeader = ({
  title,
  subtitle,
  align = "center",
  className,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}) => (
  <header className={cn(`text-${align} mb-12 sm:mb-16`, className)}>
    <h2 className="font-display text-display-sm text-foreground mb-4">{title}</h2>
    {subtitle && <p className="font-body text-body-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
  </header>
);