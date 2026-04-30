# Design System: SensAI
**Project ID:** Local Next.js application

## 1. Visual Theme & Atmosphere
SensAI should feel like a premium, focused AI career command center: calm, trustworthy, polished, and quietly intelligent. The interface uses translucent surfaces, crisp borders, measured shadows, and restrained motion to suggest an advanced SaaS platform without sacrificing readability or productivity.

## 2. Color Palette & Roles
- **Soft Studio Background** (`hsl(var(--background))`): The page canvas, with subtle spatial texture.
- **Executive Ink** (`hsl(var(--foreground))`): Primary text and strong interface labels.
- **Frosted Surface** (`hsl(var(--card))`): Cards, panels, forms, and product shells.
- **Quiet Metadata** (`hsl(var(--muted-foreground))`): Supporting copy, helper labels, timestamps, and empty states.
- **Signal Teal** (`hsl(var(--primary))`): Primary actions, completion, AI accents, progress, and high-value highlights.
- **Insight Blue** (`hsl(var(--secondary))`): Secondary analytics, interview readiness, and directional signals.
- **Momentum Amber** (`hsl(var(--accent))`): Warnings, opportunity cues, recommendations, and friendly emphasis.
- **Risk Rose** (`hsl(var(--destructive))`): Deletes, rejected status, errors, and irreversible actions.

## 3. Typography Rules
Use a modern sans-serif voice with tight hierarchy and generous line-height for explanations. Page titles are bold and direct, section headings are compact, and dense work surfaces use smaller labels with strong contrast. Letter spacing stays natural; uppercase labels are used sparingly for category markers.

## 4. Component Stylings
* **Buttons:** Subtly rounded shadcn buttons with icon-leading affordances, clear focus rings, soft shadows on primary actions, and tactile hover/active states.
* **Cards/Containers:** Frosted glass panels with `bg-card/60`, soft borders, `backdrop-blur-xl`, and a restrained lift on hover. Cards remain readable in dark mode and avoid nested-card clutter.
* **Inputs/Forms:** Clean shadcn fields with visible labels, glassy backgrounds, clear invalid/error states, and generous touch targets.
* **Badges/Status:** Color-coded but professional. Status colors are translucent fills with readable foregrounds and subtle borders.
* **Motion:** Sections enter with soft fade-up/slide motion. Interactive cards lift slightly. Reduced-motion users receive static layouts without disruptive animation.

## 5. Layout Principles
Screens use a command-center rhythm: prominent context header, concise KPI/action row, then focused work areas. Spacing is roomy on desktop but collapses into readable single-column stacks on mobile. Product previews and data panels are framed with glass shells rather than heavy decorative gradients.
