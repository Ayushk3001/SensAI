"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────────
   LIGHT MODE — Architectural / Editorial
   Inspired by luxury editorial design: cream paper, ink strokes,
   sharp geometric accents, generous negative space.
───────────────────────────────────────────────────────────── */
const lightElements = {
  rootBox: "mx-auto w-full max-w-[480px]",

  cardBox: [
    "w-full overflow-hidden",
    "rounded-2xl",
    "border border-stone-200/80",
    "bg-[#FAFAF7]",
    "shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_32px_-8px_rgba(0,0,0,0.08),0_24px_64px_-12px_rgba(0,0,0,0.06)]",
  ].join(" "),

  card: [
    "w-full bg-transparent",
    "px-10 py-10",
    "text-stone-900",
    "shadow-none",
  ].join(" "),

  header: "mb-9",
  logoBox: "mb-7 flex justify-start",
  logoImage: "h-7 w-auto object-contain rounded-md bg-stone-900 px-2.5 py-1 shadow-sm",

  headerTitle: [
    "text-stone-900 text-2xl tracking-[-0.04em]",
    "font-semibold",
  ].join(" "),

  headerSubtitle: "text-stone-400 text-sm tracking-wide mt-1 font-normal",

  socialButtons: "flex flex-col gap-2.5",

  socialButtonsBlockButton: [
    "group relative inline-flex h-11 w-full items-center justify-center gap-2.5",
    "rounded-xl border border-stone-200 bg-white",
    "px-4 text-[13px] font-medium text-stone-700",
    "shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
    "transition-all duration-200 ease-out",
    "hover:border-stone-300 hover:bg-stone-50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2",
    "active:scale-[0.99]",
  ].join(" "),

  socialButtonsBlockButtonText: "text-stone-700 text-[13px] font-medium",

  dividerRow: "my-7",
  dividerLine: "bg-stone-200",
  dividerText: "text-stone-400 text-xs uppercase tracking-[0.12em] font-medium",

  formFieldLabel:
    "text-[12px] font-medium text-stone-500 uppercase tracking-[0.08em]",

  formFieldInput: [
    "h-11 rounded-xl",
    "border-stone-200 bg-white",
    "text-stone-900 text-[14px]",
    "placeholder:text-stone-300",
    "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
    "transition-all duration-150",
    "focus:border-stone-400 focus:ring-1 focus:ring-stone-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]",
  ].join(" "),

  formButtonPrimary: [
    "inline-flex h-11 w-full items-center justify-center",
    "rounded-xl bg-stone-900 px-4",
    "text-[13px] font-semibold tracking-wide text-white",
    "shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.12)]",
    "transition-all duration-200",
    "hover:bg-stone-800 hover:shadow-[0_2px_8px_rgba(0,0,0,0.24)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2",
    "active:scale-[0.99] active:shadow-none",
  ].join(" "),

  footer:
    "border-t border-stone-100 bg-stone-50/60 px-10 py-5",
  footerActionText: "text-stone-400 text-[13px]",
  footerActionLink:
    "text-stone-700 text-[13px] font-medium underline-offset-2 hover:underline transition-colors",
};

/* ─────────────────────────────────────────────────────────────
   DARK MODE — Obsidian Glass
   Deep black surface, barely-there grain, luminous accents,
   razor-thin borders that shimmer with light.
───────────────────────────────────────────────────────────── */
const darkElements = {
  rootBox: "mx-auto w-full max-w-[440px]",

  cardBox: [
    "w-full overflow-hidden",
    "rounded-2xl",
    "border border-white/[0.06]",
    // Multi-layer shadow: subtle rim light + deep drop
    "shadow-[0_0_0_0.5px_rgba(255,255,255,0.04)_inset,0_2px_0_0_rgba(255,255,255,0.06)_inset,0_32px_64px_-16px_rgba(0,0,0,0.9),0_8px_32px_-4px_rgba(0,0,0,0.6)]",
    "bg-[#0E0E10]",
    "backdrop-blur-xl",
  ].join(" "),

  card: [
    "w-full bg-transparent",
    "px-10 py-10",
    "text-white",
    "shadow-none",
  ].join(" "),

  header: "mb-9",
  logoBox: "mb-7 flex justify-start",
  logoImage: "h-7 w-auto object-contain",

  headerTitle: [
    "text-white text-2xl tracking-[-0.04em] font-semibold",
  ].join(" "),

  headerSubtitle: "text-zinc-500 text-sm tracking-wide mt-1 font-normal",

  socialButtons: "flex flex-col gap-2",

  socialButtonsBlockButton: [
    "inline-flex h-11 w-full items-center justify-center gap-2.5",
    "rounded-xl",
    "border border-white/[0.07]",
    "bg-white/[0.04]",
    "px-4 text-[13px] font-medium text-zinc-300",
    "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
    "transition-all duration-200",
    "hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0",
    "active:scale-[0.99]",
  ].join(" "),

  socialButtonsBlockButtonText: "text-zinc-300 text-[13px] font-medium",

  dividerRow: "my-7",
  dividerLine: "bg-white/[0.07]",
  dividerText: "text-zinc-600 text-xs uppercase tracking-[0.12em] font-medium",

  formFieldLabel:
    "text-[11px] font-medium text-zinc-500 uppercase tracking-[0.1em]",

  formFieldInput: [
    "h-11 rounded-xl",
    "border-white/[0.07] bg-white/[0.04]",
    "text-white text-[14px]",
    "placeholder:text-zinc-700",
    "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
    "transition-all duration-150",
    "focus:border-white/20 focus:ring-1 focus:ring-white/10 focus:bg-white/[0.06]",
  ].join(" "),

  formButtonPrimary: [
    "inline-flex h-11 w-full items-center justify-center",
    "rounded-xl bg-white px-4",
    "text-[13px] font-semibold tracking-wide text-zinc-950",
    "shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_4px_16px_rgba(0,0,0,0.4)]",
    "transition-all duration-200",
    "hover:bg-zinc-100 hover:shadow-[0_2px_20px_rgba(255,255,255,0.12)]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
    "active:scale-[0.99] active:bg-zinc-200",
  ].join(" "),

  footer:
    "border-t border-white/[0.05] bg-white/[0.02] px-10 py-5",
  footerActionText: "text-zinc-600 text-[13px]",
  footerActionLink:
    "text-zinc-300 text-[13px] font-medium underline-offset-2 hover:text-white hover:underline transition-colors",
};

/* ─────────────────────────────────────────────────────────────
   Shared hook — composes appearance from theme
───────────────────────────────────────────────────────────── */
function useClerkAppearance() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    baseTheme: isDark ? dark : undefined,
    layout: {
      logoImageUrl: "/logo.png",
      logoPlacement: "inside",
      logoLinkUrl: "/",
      socialButtonsVariant: "blockButton",
    },
    variables: isDark
      ? {
          colorPrimary: "#ffffff",
          colorBackground: "#0E0E10",
          colorInputBackground: "rgba(255,255,255,0.04)",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#71717a",
          borderRadius: "0.75rem",
          fontSize: "14px",
        }
      : {
          colorPrimary: "#1c1917",
          colorBackground: "#FAFAF7",
          colorInputBackground: "#ffffff",
          colorInputText: "#1c1917",
          colorText: "#1c1917",
          colorTextSecondary: "#78716c",
          borderRadius: "0.75rem",
          fontSize: "14px",
        },
    elements: isDark ? darkElements : lightElements,
  };
}

/* ─────────────────────────────────────────────────────────────
   Exported Components
───────────────────────────────────────────────────────────── */
export function ThemedSignIn() {
  const appearance = useClerkAppearance();

  return (
    <SignIn
      appearance={{
        ...appearance,
        layout: {
          ...appearance.layout,
          socialButtonsPlacement: "top",
        },
      }}
    />
  );
}

export function ThemedSignUp() {
  const appearance = useClerkAppearance();
  return <SignUp appearance={appearance} />;
}