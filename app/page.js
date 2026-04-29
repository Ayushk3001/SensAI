import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/hero";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

const stats = [
  ["50+", "Industries modeled"],
  ["1000+", "Practice questions"],
  ["95%", "Users feel more prepared"],
  ["24/7", "AI career support"],
];

export default function LandingPage() {
  return (
    <>
      <HeroSection />

      <section className="border-y border-border/70 bg-card/40 py-14 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(([value, label], index) => (
            <Card key={label} className={`soft-card-hover fade-up stagger-${Math.min(index + 1, 4)} text-center`}>
              <CardContent className="p-6">
              <div className="text-4xl font-extrabold text-foreground">{value}</div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">Platform</Badge>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground">
              Everything your career needs, organized into one operating system.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className={`metric-card fade-up stagger-${Math.min((index % 4) + 1, 4)}`}>
                <CardContent className="p-0">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary ">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="border-secondary/25 bg-secondary/10 text-secondary">Workflow</Badge>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground">
              From role target to interview confidence.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <Card key={index} className={`relative overflow-hidden soft-card-hover fade-up stagger-${Math.min(index + 1, 4)}`}>
                <CardContent className="p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary  ">
                  {index + 1}
                </div>
                <div className="mb-4 text-primary">{item.icon}</div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-extrabold tracking-tight text-foreground">
            Trusted by ambitious professionals
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonial.map((t, index) => (
              <Card key={index} className={`soft-card-hover fade-up stagger-${Math.min(index + 1, 3)}`}>
                <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={t.image}
                    alt={t.author}
                    width={48}
                    height={48}
                    className="rounded-full border border-border"
                  />
                  <div>
                    <p className="font-bold text-foreground">{t.author}</p>
                    <p className="text-sm text-primary">
                      {t.role} at {t.company}
                    </p>
                  </div>
                </div>
                <Quote className="mt-5 h-5 w-5 text-primary/50" />
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t.quote}
                </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-20 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="border-accent/25 bg-accent/10 text-accent">FAQ</Badge>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground">
              Questions before you begin
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-border/70 bg-card/65 px-5 shadow-sm backdrop-blur-xl"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground">
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

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-primary/25 bg-primary/95 p-8 text-primary-foreground shadow-xl shadow-primary/20 backdrop-blur-xl sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card/15 px-3 py-1 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Ready when you are
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Build your next career move with clarity.
              </h2>
              <p className="mt-4 max-w-2xl text-teal-50">
                SensAI brings documents, interviews, applications, and learning plans into one focused workspace.
              </p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Start today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
