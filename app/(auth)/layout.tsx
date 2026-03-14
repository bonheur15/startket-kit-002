import Link from "next/link";
import type { ReactNode } from "react";
import { appName } from "@/lib/app-config";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-sm flex-col items-center justify-center gap-6">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          {appName}
        </Link>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
