"use client";

import React from "react";
import {
  PenBox,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Mic,
  Map,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/resume", icon: FileText, label: "Resume Studio", desc: "ATS scoring and tailoring", tone: "text-primary" },
  { href: "/ai-cover-letter", icon: PenBox, label: "Cover Letters", desc: "Role-specific drafts", tone: "text-secondary" },
  { href: "/job-tracker", icon: BriefcaseBusiness, label: "Job Tracker", desc: "Pipeline and assets", tone: "text-primary" },
  { href: "/interview", icon: GraduationCap, label: "Interview Prep", desc: "Quiz practice and history", tone: "text-accent" },
  { href: "/interview/voice", icon: Mic, label: "Voice Interview", desc: "Live speaking simulation", tone: "text-rose-600" },
  { href: "/roadmap", icon: Map, label: "Career Roadmap", desc: "Learning milestones", tone: "text-secondary" },
];

export default function GrowthDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="shadow-teal-500/20">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Growth Tools</span>
          <ChevronDown className="h-4 w-4 opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[310px] rounded-lg border-border bg-popover/95 p-2 text-popover-foreground shadow-xl shadow-slate-300/30 dark:shadow-none backdrop-blur dark:shadow-none"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="text-sm font-bold text-popover-foreground">Growth Tools</div>
          <div className="mt-1 text-xs font-normal text-muted-foreground">
            Your AI career workspace
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 focus:bg-primary/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className={`h-4 w-4 ${item.tone}`} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-popover-foreground">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.desc}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
