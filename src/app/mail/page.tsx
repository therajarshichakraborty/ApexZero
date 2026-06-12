"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/mail/sidebar";
import { InboxList } from "@/components/mail/inbox-list";
import { EmailReader } from "@/components/mail/email-reader";
import { AiAssistant } from "@/components/mail/ai-assistant";
import { ComposeModal } from "@/components/mail/compose-modal";
import { CommandPalette } from "@/components/mail/command-palette";
import { useApp } from "@/lib/store";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function Mail() {
  const { sidebarOpen, assistantOpen } = useApp();

  useEffect(() => {
    // Prevent the root document/body from scrolling to avoid double scrollbars on the window
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* ── Sidebar ─────────────────────────────────── */}
      {sidebarOpen && (
        <div className="flex h-full w-[200px] shrink-0 flex-col border-r border-border bg-background">
          <Sidebar />
        </div>
      )}

      {/* ── Resizable: Inbox list + Reader + AI ──────── */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0">
        {/* Inbox list panel */}
        <ResizablePanel defaultSize="22%" minSize={0}>
          <InboxList />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Email reader panel */}
        <ResizablePanel defaultSize="50%" minSize={0}>
          <EmailReader />
        </ResizablePanel>

        {assistantOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="28%" minSize={0}>
              <AiAssistant />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <ComposeModal />
      <CommandPalette />
    </div>
  );
}
