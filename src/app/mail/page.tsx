"use client";

import Link from "next/link";
import { Sidebar } from "@/components/mail/sidebar";
import { InboxList } from "@/components/mail/inbox-list";
import { EmailReader } from "@/components/mail/email-reader";
import { AiAssistant } from "@/components/mail/ai-assistant";
import { ComposeModal } from "@/components/mail/compose-modal";
import { CommandPalette } from "@/components/mail/command-palette";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function Mail() {
  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-background">

      {/* ── Sidebar ─────────────────────────────────── */}
      <div className="flex h-full w-[200px] shrink-0 flex-col border-r border-border">
        {/* macOS-style window controls */}
        <div className="flex items-center gap-1.5 px-4 pt-4 pb-2 shrink-0">
          <Link
            href="/"
            title="Back to Home"
            className="group flex items-center justify-center h-2.5 w-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:scale-110 transition-transform"
          >
            <span className="text-[6px] text-[#4c0002] font-black opacity-0 group-hover:opacity-100 transition-opacity leading-none">
              ✕
            </span>
          </Link>
          <div className="flex items-center justify-center h-2.5 w-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="flex items-center justify-center h-2.5 w-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-elegant">
          <Sidebar hideHeader={true} />
        </div>
      </div>

      {/* ── Resizable: Inbox list + Reader + AI ──────── */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0">

        {/* Inbox list panel — default 280px, min 180px, max 420px */}
        <ResizablePanel defaultSize={280} minSize="180px" maxSize="420px" groupResizeBehavior="preserve-pixel-size">
          <InboxList />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Email reader + AI assistant */}
        <ResizablePanel defaultSize={0}>
          <div className="flex h-full min-w-0 overflow-hidden">
            <EmailReader />
            <AiAssistant />
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>

      <ComposeModal />
      <CommandPalette />
    </div>
  );
}

