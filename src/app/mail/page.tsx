"use client";

import Link from "next/link";
import { Sidebar } from "@/components/mail/sidebar";
import { InboxList } from "@/components/mail/inbox-list";
import { EmailReader } from "@/components/mail/email-reader";
import { AiAssistant } from "@/components/mail/ai-assistant";
import { ComposeModal } from "@/components/mail/compose-modal";
import { CommandPalette } from "@/components/mail/command-palette";

export default function Mail() {
  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-background select-none">

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

      {/* ── Inbox list + Reader + AI ─────────────────── */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <InboxList />

        <div className="flex flex-1 min-w-0 overflow-hidden">
          <EmailReader />
          <AiAssistant />
        </div>
      </div>

      <ComposeModal />
      <CommandPalette />
    </div>
  );
}
