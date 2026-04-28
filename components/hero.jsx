"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative overflow-hidden pt-28">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center px-4 pb-12 text-center sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shadow-sm">
            <Sparkles className="h-4 w-4" />
            SensAI Career Operating System
          </div>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Run your career like a premium command center.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Build tailored resumes, practice interviews, track roles, read market signals,
            and follow a learning roadmap from one calm AI workspace.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Open Career OS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => setShowVideo((value) => !value)}
            >
              <Play className="h-4 w-4" />
              {showVideo ? "Close Demo" : "Watch Demo"}
            </Button>
          </div>
        </div>

        <div className="relative mt-12 w-full">
          {showVideo ? (
            <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-slate-300/30 dark:shadow-none">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/CZu3ANlo2d8?autoplay=1"
                  title="SensAI demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-6xl rounded-lg border border-border bg-card p-3 shadow-2xl shadow-slate-300/30 dark:shadow-none">
              <div className="overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src="/banner7.png"
                  alt="SensAI dashboard preview"
                  width={1800}
                  height={1100}
                  priority
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
