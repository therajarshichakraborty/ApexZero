"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFullMessagesByLabel,
  toggleStarMessage,
  archiveMessage,
  trashMessage,
  sendEmail as sendEmailAction,
  markReadMessage,
  getMessage,
} from "@/actions/mail/getInbox";
import type { Email } from "@/lib/mock-data";

export function useEmails(folder: string, search: string = "") {
  return useQuery({
    queryKey: ["emails", folder, search],
    queryFn: () => getFullMessagesByLabel(folder, search),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev, // show previous data while loading
  });
}

export function useMail(folder: string, searchQuery?: string) {
  return useEmails(folder, searchQuery ?? "");
}

export function useMailPrefetch() {
  const queryClient = useQueryClient();

  return function prefetch(folder: string) {
    queryClient.prefetchQuery({
      queryKey: ["emails", folder, ""],
      queryFn: () => getFullMessagesByLabel(folder),
      staleTime: 30 * 1000,
    });
  };
}

export function useEmailBody(messageId: string | null) {
  return useQuery({
    queryKey: ["email-body", messageId],
    queryFn: () => getMessage(messageId!),
    enabled: !!messageId, // only fetches when messageId exists
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}

export function useEmailMutations() {
  const queryClient = useQueryClient();

  const starMutation = useMutation({
    mutationFn: ({ id, star }: { id: string; star: boolean }) => toggleStarMessage(id, star),
    onMutate: async ({ id, star }) => {
      queryClient.setQueriesData({ queryKey: ["emails"] }, (old: Email[] | undefined) => {
        if (!old) return old;
        return old.map((e) => (e.id === id ? { ...e, starred: star } : e));
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markReadMessage(id),
    onMutate: async (id) => {
      queryClient.setQueriesData({ queryKey: ["emails"] }, (old: Email[] | undefined) => {
        if (!old) return old;
        return old.map((e) => (e.id === id ? { ...e, unread: false } : e));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveMessage(id),
    onMutate: async (id) => {
      queryClient.setQueriesData({ queryKey: ["emails"] }, (old: Email[] | undefined) => {
        if (!old) return old;
        return old.filter((e) => e.id !== id);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });

  const trashMutation = useMutation({
    mutationFn: (id: string) => trashMessage(id),
    onMutate: async (id) => {
      queryClient.setQueriesData({ queryKey: ["emails"] }, (old: Email[] | undefined) => {
        if (!old) return old;
        return old.filter((e) => e.id !== id);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: sendEmailAction,
    onSuccess: () => {
      // Trigger a sync in the background so the sent message is pulled into the DB
      fetch("/api/sync-gmail", { method: "POST" }).catch(() => {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", "sent"] });
    },
  });

  return {
    toggleStar: (id: string, star: boolean) => starMutation.mutate({ id, star }),
    markRead: (id: string) => markReadMutation.mutate(id),
    archive: (id: string) => archiveMutation.mutate(id),
    trash: (id: string) => trashMutation.mutate(id),
    sendEmail: (args: Parameters<typeof sendEmailAction>[0]) => sendMutation.mutateAsync(args),
  };
}
