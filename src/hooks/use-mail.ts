"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFullMessagesByLabel,
  toggleStarMessage,
  archiveMessage,
  trashMessage,
  sendEmail as sendEmailAction,
  markReadMessage,
} from "@/actions/mail/getInbox";
import type { Email } from "@/lib/mock-data";

export function useEmails(folder: string, search: string = "") {
  return useQuery({
    queryKey: ["emails", folder, search],
    queryFn: () => getFullMessagesByLabel(folder, search),
  });
}

export function useEmailMutations() {
  const queryClient = useQueryClient();

  const starMutation = useMutation({
    mutationFn: ({ id, star }: { id: string; star: boolean }) =>
      toggleStarMessage(id, star),
    onMutate: async ({ id, star }) => {
      queryClient.setQueriesData({ queryKey: ["emails"] }, (old: Email[] | undefined) => {
        if (!old) return old;
        return old.map((e) => (e.id === id ? { ...e, starred: star } : e));
      });
    },
    onSettled: () => {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", "sent"] });
    },
  });

  return {
    toggleStar: (id: string, star: boolean) => starMutation.mutate({ id, star }),
    markRead: (id: string) => markReadMutation.mutate(id),
    archive: (id: string) => archiveMutation.mutate(id),
    trash: (id: string) => trashMutation.mutate(id),
    sendEmail: sendMutation.mutateAsync,
  };
}
