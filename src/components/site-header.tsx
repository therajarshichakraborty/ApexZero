"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8 rounded-full border border-border" />;
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground hover:scale-110 active:scale-95"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

interface SiteHeaderProps {
  /** Show the section nav links (Features / How it works / Pricing / FAQ).
   *  Pass false on pages that don't have those anchor sections. */
  showNav?: boolean;
  /** Minimal mode — hides UserButton and Open App CTA.
   *  Use on auth pages where those actions are redundant or confusing. */
  minimal?: boolean;
}

export function SiteHeader({ showNav = true, minimal = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-sm shadow-border" : "bg-background/80"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-background text-[10px] font-bold tracking-tight">
            AZ
          </span>
          <span className="text-[15px]">ApexZero</span>
        </Link>

        {/* Section nav — only on landing */}
        {showNav && (
          <nav className="hidden items-center gap-6 md:flex">
            {["Features", "How it works", "Pricing", "FAQ"].map((l) => (
              <a
                key={l}
                href={`/#${l.toLowerCase().replace(/ /g, "-")}`}
                className="group relative text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {l}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {!minimal && <UserButton />}
          {!minimal && (
            <Link
              href="/mail"
              className="flex h-8 items-center gap-1.5 rounded-full bg-foreground px-4 text-[13px] font-medium text-background transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95"
            >
              Open App <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
