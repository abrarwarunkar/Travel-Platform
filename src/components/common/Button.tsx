"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md font-nav transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [transition-timing-function:var(--ease-spring)]";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
      link: "bg-transparent px-0 text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "text-body-sm px-4 py-2",
      md: "text-body-sm px-6 py-3",
      lg: "text-body-md px-8 py-4",
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";