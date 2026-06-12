"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Mail, Calendar } from "lucide-react";
import Link from "next/link";

interface UserButtonProps {
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export function UserButton({ align = "end", side = "bottom", sideOffset = 8 }: UserButtonProps) {
  const { user, isAuthenticated, signOut, isPending } = useAuth();

  if (isPending) return <div className="h-8.5 w-8.5 rounded-full bg-muted animate-pulse" />;
  if (!isAuthenticated || !user) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  const fallbackText = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none group/avatar cursor-pointer">
        <Avatar className="h-8.5 w-8.5 ring-1 ring-border/60 group-hover/avatar:ring-foreground/50 transition-all shadow-sm duration-300 group-hover/avatar:scale-[1.04] group-active/avatar:scale-[0.96]">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{fallbackText}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="w-58 p-1.5 rounded-2xl bg-popover/90 backdrop-blur-xl border border-border/40 shadow-[0_12px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] dark:shadow-black/60 shadow-neutral-900/10 transition-all duration-300"
      >
        <DropdownMenuLabel className="font-normal p-2.5 mb-1.5 rounded-xl bg-muted/40 border border-border/10">
          <div className="flex flex-col space-y-1">
            <p className="text-[13px] font-semibold tracking-tight text-foreground leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate leading-none">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <div className="flex flex-col gap-0.5">
          <DropdownMenuItem
            asChild
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[12.5px] font-medium text-muted-foreground focus:text-foreground focus:bg-muted/50 transition-all duration-200 active:scale-[0.98] cursor-pointer outline-none border border-transparent"
          >
            <Link href="/mail" className="w-full">
              <Mail className="h-4 w-4 text-muted-foreground/60 group-focus:text-foreground transition-colors" />
              <span>Inbox</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[12.5px] font-medium text-muted-foreground focus:text-foreground focus:bg-muted/50 transition-all duration-200 active:scale-[0.98] cursor-pointer outline-none border border-transparent"
          >
            <Link href="/calendar" className="w-full">
              <Calendar className="h-4 w-4 text-muted-foreground/60 group-focus:text-foreground transition-colors" />
              <span>Calendar</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 border-t border-border/30" />

          <DropdownMenuItem
            onClick={() => signOut()}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold text-rose-500 focus:text-rose-600 focus:bg-rose-500/10 dark:focus:bg-rose-500/15 transition-all duration-200 active:scale-[0.98] cursor-pointer outline-none border border-transparent"
          >
            <LogOut className="h-4 w-4 text-rose-500 transition-transform duration-200 group-focus:translate-x-0.5" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
