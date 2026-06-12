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
  if (!mounted) return <div className="h-8.5 w-8.5 rounded-full border border-border/60" />;
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="grid h-8.5 w-8.5 place-items-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
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
      className={`sticky top-3 z-50 mx-auto w-[92%] md:w-[75%] max-w-5xl transition-all duration-300 rounded-full ${
        scrolled
          ? "bg-background/50 border-border/40 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.03)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="flex h-13 w-full items-center gap-8 px-6">
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
          {!minimal && <UserButton align="end" side="bottom" sideOffset={10} />}
          {!minimal && (
            <Link
              href="/mail"
              className="relative p-[1px] overflow-hidden rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer group shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              {/* Spinning gradient border */}
              <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_25%,#a3a3a3_50%,#737373_75%,#171717_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#a3a3a3_25%,#404040_50%,#a3a3a3_75%,#ffffff_100%)] opacity-35 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex h-8 items-center gap-1.5 rounded-full bg-neutral-950 dark:bg-white px-4.5 text-[12px] font-semibold tracking-wide text-white dark:text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                {/* Shimmer sweep */}
                <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/15 dark:via-neutral-950/5 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="flex items-center gap-1.5">
                  Open App{" "}
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
