import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Plug } from "lucide-react";
import Link from "next/link";

export default function ConnectPage() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/mail">
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Plug className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your accounts to start managing your data within ApexZero.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-[#EA4335]/10 text-[#EA4335]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Gmail</h3>
                <p className="text-xs text-muted-foreground">Sync your inbox and send emails</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="h-8">
              <a href="/api/connect?plugin=gmail">Connect</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
