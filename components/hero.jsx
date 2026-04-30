import React from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Play,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import LandingFrameAnimation from "@/components/landing-frame-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const heroSignals = [
  { label: "Private workspace", icon: ShieldCheck },
  { label: "Market-aware guidance", icon: Radar },
  { label: "Role-to-offer flow", icon: Route },
];

const commandMetrics = [
  {
    label: "Resume match",
    value: "92%",
    tone: "text-primary",
    bar: "bg-primary",
  },
  {
    label: "Interview readiness",
    value: "84%",
    tone: "text-secondary",
    bar: "bg-secondary",
  },
  {
    label: "Opportunity momentum",
    value: "+18%",
    tone: "text-accent",
    bar: "bg-accent",
  },
];

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-border/70 pt-20">
      <LandingFrameAnimation />

      <div className="relative z-10 mx-auto flex min-h-[calc(92svh-5rem)] max-w-7xl flex-col justify-end px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pb-14 lg:pt-24">
        <div className="grid min-w-0 items-end gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.45fr)]">
          <div className="min-w-0 max-w-[22rem] fade-up sm:max-w-4xl">
            <Badge
              variant="outline"
              className="mb-5 gap-2 border-primary/25 bg-card/60 px-3 py-1.5 text-primary shadow-sm backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" />
              SensAI Career Operating System
            </Badge>
            <h1 className="max-w-full text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl sm:leading-[1.05] lg:text-7xl">
              Run your career like a premium command center.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              Build sharper resumes, rehearse interviews, track applications,
              read market signals, and follow a learning roadmap from one calm
              AI workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/dashboard">
                  Open Career OS
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-border/80 bg-card/55 backdrop-blur-xl sm:w-auto"
                asChild
              >
                <a
                  href="https://www.youtube.com/watch?v=CZu3ANlo2d8"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Play className="h-4 w-4" />
                  Watch Demo
                </a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
              {heroSignals.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-card/55 px-3 py-2 backdrop-blur-xl"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <aside className="hidden fade-up stagger-3 lg:block">
            <div className="rounded-lg border border-border/70 bg-card/60 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Command Readout
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Next move forecast
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Active
                </span>
              </div>

              <div className="space-y-4 py-4">
                {commandMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className={`font-bold ${metric.tone}`}>{metric.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${metric.bar}`}
                        style={{ width: metric.value.includes("+") ? "72%" : metric.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border/70 pt-4">
                <div className="rounded-md border border-border/70 bg-background/55 p-3">
                  <Target className="mb-3 h-4 w-4 text-secondary" />
                  <p className="text-xs text-muted-foreground">Role target</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Senior Product AI
                  </p>
                </div>
                <div className="rounded-md border border-border/70 bg-background/55 p-3">
                  <BriefcaseBusiness className="mb-3 h-4 w-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Pipeline</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    12 roles tracked
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex">
          <ArrowDown className="h-4 w-4 text-primary" />
          Explore the platform
        </div>
      </div>
    </section>
  );
}
