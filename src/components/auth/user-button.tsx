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

export function UserButton() {
  const { user, isAuthenticated, signOut, isPending } = useAuth();

  if (isPending) return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
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
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border hover:ring-foreground transition-all">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{fallbackText}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/mail" className="flex items-center gap-2 cursor-pointer">
            <Mail className="h-4 w-4" />
            Inbox
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/calendar" className="flex items-center gap-2 cursor-pointer">
            <Calendar className="h-4 w-4" />
            Calendar
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
