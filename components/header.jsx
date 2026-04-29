// components/header.jsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderAuthActions } from "@/components/header-auth-actions";

export default async function Header() {
  await checkUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[60px] border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-[rgba(255,255,255,0.07)] dark:bg-[rgba(6,6,8,0.92)]">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left — Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="SensAI"
            width={150}
            height={45}
            className="h-10 w-auto rounded-md bg-foreground px-2 py-1 object-contain shadow-sm ring-1 ring-border dark:bg-transparent dark:px-0 dark:py-0 dark:ring-0"
            priority
          />
          <span className="hidden rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 md:inline-flex">
            Career OS
          </span>
        </Link>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <HeaderAuthActions />
        </div>
      </nav>
    </header>
  );
}
