"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";

const FEATURES = [
  { label: "AI Priority Scoring", desc: "Surfaces what matters before you do." },
  { label: "Smart Compose", desc: "Draft replies in seconds, in your voice." },
  { label: "Command Palette", desc: "Every action, one keystroke away." },
];

export function LoginForm() {
  const { signInWithProvider, isPending } = useAuth();

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] mx-auto">
      {/* Logo — identical to nav AZ mark */}
      <div className="mb-7 grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background text-[13px] font-bold tracking-tight select-none">
        AZ
      </div>

      {/* Eyebrow */}
      <p className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 select-none">
        AI-Native · Zero Setup
      </p>

      {/* Headline */}
      <h1 className="text-[1.65rem] font-bold tracking-tight text-foreground text-center leading-tight mb-2.5">
        Sign in to ApexZero
      </h1>
      <p className="text-[13.5px] text-muted-foreground text-center leading-relaxed mb-8">
        Move through email at the speed of thought.
      </p>

      {/* Feature list */}
      <div className="w-full flex flex-col gap-3 mb-8">
        {FEATURES.map(({ label, desc }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            <div>
              <span className="text-[13px] font-semibold text-foreground">{label}</span>
              <span className="text-[13px] text-muted-foreground"> — {desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-border mb-7" />

      {/* Auth Buttons */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Google */}
        <button
          onClick={() => signInWithProvider("google")}
          disabled={isPending}
          className="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-full border border-border bg-background text-[13.5px] font-medium text-foreground transition-all duration-150 hover:bg-muted hover:border-foreground/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
          ) : (
            <svg className="h-[15px] w-[15px] shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        {/* GitHub */}
        <button
          onClick={() => signInWithProvider("github")}
          disabled={isPending}
          className="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-full border border-border bg-background text-[13.5px] font-medium text-foreground transition-all duration-150 hover:bg-muted hover:border-foreground/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
          ) : (
            <svg className="h-[15px] w-[15px] shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          )}
          Continue with GitHub
        </button>
      </div>

      {/* Social proof */}
      <p className="mt-6 text-[11.5px] text-muted-foreground/70 text-center leading-relaxed">
        Trusted by teams at <span className="font-semibold text-muted-foreground">Stripe</span>,{" "}
        <span className="font-semibold text-muted-foreground">Vercel</span> &amp;{" "}
        <span className="font-semibold text-muted-foreground">Linear</span>
      </p>

      {/* Terms */}
      <p className="mt-3 text-center text-[11px] text-muted-foreground/50 leading-relaxed">
        By continuing you agree to our{" "}
        <span className="underline underline-offset-2 cursor-pointer hover:text-muted-foreground transition-colors">
          Terms
        </span>{" "}
        &amp;{" "}
        <span className="underline underline-offset-2 cursor-pointer hover:text-muted-foreground transition-colors">
          Privacy
        </span>
        .
      </p>
    </div>
  );
}
