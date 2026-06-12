"use client";

import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  const signInWithProvider = async (provider: "google" | "github", callbackURL = "/mail") => {
    await authClient.signIn.social({
      provider,
      callbackURL,
    });
  };

  const signOut = async (callbackURL = "/login") => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(callbackURL);
        },
      },
    });
  };

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isPending,
    error,
    signInWithProvider,
    signOut,
  };
}
