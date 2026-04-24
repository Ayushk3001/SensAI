# SensAI

SensAI is a full-stack AI career coach built with Next.js. It helps authenticated users complete a professional profile, review industry insights, build ATS-focused resumes, generate cover letters, practice interviews, run voice-based mock interviews, and create personalized career roadmaps with learning resources.

## Features

- Clerk authentication with protected dashboard, resume, interview, onboarding, and cover-letter routes.
- Personalized onboarding for industry, specialization, experience, skills, and professional bio.
- AI-generated industry insights with salary ranges, growth rate, demand level, market outlook, trends, and recommended skills.
- ATS resume analysis that compares a resume against a job description, identifies missing keywords, suggests improvements, and stores a tailored Markdown resume.
- Cover letter generation based on a job title, company, job description, and resume/profile context.
- Technical quiz generation, assessment history, performance charts, and improvement tips.
- Live voice interview flow for technical, HR/behavioral, aptitude, and managerial interviews using speech-to-text, chat completion, text-to-speech, and AI scoring.
- Career roadmap generator with interactive React Flow nodes and recommended YouTube learning videos for each roadmap topic.
- Weekly Inngest background job for refreshing industry insights with Gemini.

## Tech Stack

- Next.js 15 App Router and React 19
- Tailwind CSS, Radix UI primitives, shadcn-style UI components, lucide-react icons, and next-themes
- Clerk for authentication
- PostgreSQL with Prisma ORM
- OpenAI API for roadmaps, resume analysis, cover letters, quizzes, voice interviews, transcription, and speech generation
- Google Gemini through Inngest for scheduled industry insight refreshes
- React Flow for roadmap visualization
- Recharts for interview performance analytics
- pdf-parse and react-pdftotext for PDF text extraction
- yt-search for roadmap learning video suggestions

## Project Structure

```text
actions/              Server actions for users, dashboard insights, resumes, interviews, and cover letters
app/                  Next.js routes, API handlers, layouts, and page components
components/           Shared UI, header, hero, theme provider, and dropdown components
data/                 Landing page content, FAQs, industries, testimonials, and feature lists
hooks/                Reusable client hooks
lib/                  Prisma client, Clerk helpers, utility functions, and Inngest setup
prisma/               Prisma schema and database migrations
public/               Logo, banner images, and static assets
```

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm
- PostgreSQL database
- Clerk application keys
- OpenAI API key
- Gemini API key for scheduled industry insight refreshes

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

OPENAI_API_KEY=
GEMINI_API_KEY=
```

3. Apply the Prisma migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

## Available Scripts

```bash
npm run dev      # Start the Next.js development server with Turbopack
npm run build    # Build the production application
npm run start    # Start the production server
npm run lint     # Run the configured Next.js lint command
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk key for browser-side authentication. |
| `CLERK_SECRET_KEY` | Server-side Clerk key for protected routes and user lookup. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route, currently `/sign-in`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route, currently `/sign-up`. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in, currently `/onboarding`. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up, currently `/onboarding`. |
| `OPENAI_API_KEY` | Powers resume analysis, cover letters, quizzes, roadmaps, voice interview transcription, chat, TTS, and evaluation. |
| `GEMINI_API_KEY` | Powers scheduled industry insight refreshes through Inngest. |

## Database

The Prisma schema defines the main application data:

- `User`: Clerk-linked profile, onboarding details, skills, resume, assessments, and cover letters.
- `Assessment`: quiz/interview practice results with question history and improvement tips.
- `Resume`: one Markdown resume per user with ATS score and feedback fields.
- `CoverLetter`: generated cover letters tied to a company, job title, and job description.
- `IndustryInsight`: salary ranges, growth data, demand level, market outlook, trends, and recommended skills per industry.

Run Prisma Studio when you need to inspect local data:

```bash
npx prisma studio
```

## AI and Background Jobs

Most interactive AI flows use the OpenAI SDK from server actions or API routes. The scheduled Inngest function in `lib/inngest/function.js` refreshes existing industry insight records every Sunday at midnight using Gemini. The Inngest handler is exposed through `app/api/inngest/route.js`.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
