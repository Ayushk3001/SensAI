"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GrowthDropdown from "@/components/GrowthDropdown";
import { Button } from "@/components/ui/button";

function SignedOutAction() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  return (
    <Button
      size="sm"
      variant={isAuthPage ? "outline" : "default"}
      className={
        isAuthPage
          ? "border-border/70 bg-background/40 text-foreground shadow-sm backdrop-blur-xl hover:bg-muted/60"
          : "shadow-teal-500/20"
      }
      asChild
    >
      <Link href="/sign-in">
        <LogIn className="h-4 w-4" />
        Sign In
      </Link>
    </Button>
  );
}

export function HeaderAuthActions() {
  return (
    <>
      <SignedIn>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </Link>
        </Button>
        <GrowthDropdown />
      </SignedIn>

      <SignedOut>
        <SignedOutAction />
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-border shadow-sm",
              userButtonPopoverCard:
                "shadow-xl border border-border bg-card text-card-foreground",
              userPreviewMainIdentifier: "font-semibold",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </>
  );
}
