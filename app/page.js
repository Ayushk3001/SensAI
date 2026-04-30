import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageSquareText,
  Quote,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { testimonial } from "@/data/testimonial";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: "50+",
    label: "Industries modeled",
    detail: "Role signals calibrated for real career paths",
  },
  {
    value: "1k+",
    label: "Interview prompts",
    detail: "Technical, HR, aptitude, and managerial practice",
  },
  {
    value: "95%",
    label: "Readiness lift",
    detail: "Users report clearer interview confidence",
  },
  {
    value: "24/7",
    label: "Career support",
    detail: "Documents, tracking, and roadmaps stay organized",
  },
];

const capabilities = [
  {
    title: "Resume intelligence",
    description:
      "Create ATS-ready resumes, tune job-match keywords, and keep versions aligned to each role.",
    icon: FileText,
    tone: "primary",
  },
  {
    title: "Adaptive interview practice",
    description:
      "Train with mock and live voice interviews that adjust to your role, seniority, and weak spots.",
    icon: MessageSquareText,
    tone: "secondary",
  },
  {
    title: "Job pipeline command",
    description:
      "Track applications, stages, notes, and next actions without losing context between opportunities.",
    icon: BriefcaseBusiness,
    tone: "accent",
  },
  {
    title: "Market signal layer",
    description:
      "Read salary movement, skill demand, and industry trends before shaping your next move.",
    icon: Radar,
    tone: "secondary",
  },
  {
    title: "Learning roadmaps",
    description:
      "Generate milestone-based paths that convert career goals into practical weekly progress.",
    icon: Route,
    tone: "primary",
  },
  {
    title: "Performance analytics",
    description:
      "Watch interview scores, skill gaps, and preparation momentum improve across sessions.",
    icon: BarChart3,
    tone: "accent",
  },
];

const workflowSteps = [
  {
    title: "Role target",
    description: "Set the position, industry, seniority, and skills SensAI should optimize around.",
    icon: Target,
    tone: "secondary",
  },
  {
    title: "Resume",
    description: "Generate a tailored resume and cover letter with stronger alignment to the role.",
    icon: ClipboardList,
    tone: "primary",
  },
  {
    title: "Interview",
    description: "Practice the conversations that matter, then convert feedback into focused drills.",
    icon: UsersRound,
    tone: "accent",
  },
  {
    title: "Job tracking",
    description: "Manage applications, follow-ups, notes, and decisions in a single career pipeline.",
    icon: BriefcaseBusiness,
    tone: "secondary",
  },
  {
    title: "Roadmap",
    description: "Turn gaps into milestones with a learning plan that stays connected to your goals.",
    icon: GraduationCap,
    tone: "primary",
  },
];

const trustMarkers = [
  "Private career workspace",
  "Structured around real hiring workflows",
  "Built for focused progress",
];

const toneStyles = {
  primary: {
    badge: "border-primary/25 bg-primary/10 text-primary",
    icon: "bg-primary/10 text-primary ring-primary/20",
    accent: "text-primary",
  },
  secondary: {
    badge: "border-secondary/25 bg-secondary/10 text-secondary",
    icon: "bg-secondary/10 text-secondary ring-secondary/20",
    accent: "text-secondary",
  },
  accent: {
    badge: "border-accent/30 bg-accent/10 text-accent",
    icon: "bg-accent/10 text-accent ring-accent/25",
    accent: "text-accent",
  },
};

function SectionIntro({ eyebrow, title, description, align = "left", tone = "primary" }) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      <Badge
        variant="outline"
        className={cn("gap-2 px-3 py-1.5", toneStyles[tone].badge)}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </Badge>
      <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />

      <section className="relative z-20 border-y border-border/70 bg-card/45 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl divide-y divide-border/70 px-4 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="py-6 md:px-5 lg:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {stat.label}
                  </p>
                </div>
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="platform" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
            <SectionIntro
              eyebrow="Platform"
              title="Everything your career needs, organized into one operating system."
              description="SensAI keeps the work of getting hired connected: documents, interviews, job movement, market context, and learning plans all inform the next action."
            />
            <div className="rounded-lg border border-border/70 bg-card/55 p-5 text-sm leading-7 text-muted-foreground shadow-sm backdrop-blur-xl">
              <BrainCircuit className="mb-4 h-5 w-5 text-primary" />
              The workspace is built for repeated use: scan quickly, act deliberately,
              and return to the same career context without rebuilding momentum.
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <Card
                  key={capability.title}
                  className={cn(
                    "soft-card-hover overflow-hidden",
                    `fade-up stagger-${Math.min((index % 4) + 1, 4)}`
                  )}
                >
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        "mb-5 flex h-11 w-11 items-center justify-center rounded-lg ring-1",
                        toneStyles[capability.tone].icon
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {capability.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {capability.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/35 py-20 backdrop-blur-xl sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Workflow"
            title="A cleaner path from role target to career momentum."
            description="The product flow mirrors how ambitious professionals actually move: define the target, sharpen the materials, rehearse, track, then close the skill gaps."
            align="center"
            tone="secondary"
          />

          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className={cn(
                    "relative rounded-lg border border-border/70 bg-background/60 p-5 shadow-sm backdrop-blur-xl",
                    `fade-up stagger-${Math.min(index + 1, 4)}`
                  )}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
                        toneStyles[step.tone].icon
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Proof"
            title="Trusted by professionals who want cleaner decisions."
            description="SensAI gives users a calmer way to prepare, compare, and move with intent."
            align="center"
            tone="accent"
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonial.map((item, index) => (
              <Card
                key={item.author}
                className={cn(
                  "soft-card-hover",
                  `fade-up stagger-${Math.min(index + 1, 3)}`
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.author}
                      width={48}
                      height={48}
                      className="rounded-lg border border-border object-cover"
                    />
                    <div>
                      <p className="font-bold text-foreground">{item.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.role} at {item.company}
                      </p>
                    </div>
                  </div>
                  <Quote className="mt-6 h-5 w-5 text-primary/55" />
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.quote}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/35 py-20 backdrop-blur-xl sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="FAQ"
            title="Questions before you begin."
            align="center"
            tone="primary"
          />
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-lg border border-border/70 bg-card/60 px-5 shadow-sm backdrop-blur-xl"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-border/70 bg-card/45 py-16 backdrop-blur-xl sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <Badge
              variant="outline"
              className="border-primary/25 bg-primary/10 px-3 py-1.5 text-primary"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Ready when you are
            </Badge>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Build your next career move with clarity.
            </h2>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {trustMarkers.map((marker) => (
                <span
                  key={marker}
                  className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/55 px-3 py-2"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {marker}
                </span>
              ))}
            </div>
          </div>

          <Button size="lg" asChild>
            <Link href="/dashboard">
              Open Career OS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
