# SensAI

SensAI is a full-stack AI career coach built with Next.js. It helps users build a professional career profile, view AI-generated industry insights, improve resumes for ATS matching, generate cover letters, practice interviews, complete live voice mock interviews, and create role-based learning roadmaps with recommended YouTube tutorials.

## What It Does

- Authenticates users with Clerk and protects dashboard, resume, interview, onboarding, and cover-letter routes.
- Onboards users with industry, specialization, experience, bio, and skills.
- Generates industry insights such as salary ranges, growth rate, demand level, market outlook, trends, top skills, and recommended skills.
- Analyzes resumes against job descriptions, returns an ATS score, highlights missing keywords, suggests improvements, and saves a tailored Markdown resume.
- Creates personalized cover letters from a job title, company name, job description, and resume/profile context.
- Generates technical interview quizzes, saves assessment history, and shows performance analytics.
- Runs voice-based mock interviews for technical, HR/behavioral, aptitude, and managerial interview styles.
- Transcribes candidate audio, generates interviewer responses, converts replies to speech, and evaluates the final interview.
- Builds interactive career roadmaps with React Flow and recommends learning videos for each roadmap topic.
- Refreshes stored industry insights weekly through an Inngest scheduled background job.

## Tech Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS
- Radix UI primitives and shadcn-style components
- Clerk authentication
- Prisma ORM with PostgreSQL
- OpenAI SDK for AI career workflows, audio transcription, and text-to-speech
- Google Gemini for scheduled industry insight refreshes
- Inngest for background jobs
- React Flow for roadmap visualization
- Recharts for interview analytics
- pdf-parse and react-pdftotext for PDF extraction
- yt-search for tutorial recommendations

## Project Structure

```text
actions/              Server actions for users, resumes, interviews, dashboard insights, and cover letters
app/                  Next.js App Router pages, layouts, API routes, and route groups
components/           Shared UI components, header, hero section, theme provider, and navigation controls
data/                 Landing page content, FAQs, features, industries, testimonials, and process steps
hooks/                Reusable client hooks
lib/                  Prisma client, Clerk user helper, utilities, and Inngest setup
prisma/               Prisma schema and database migrations
public/               Logo, banner images, favicon, and static assets
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with product overview, features, testimonials, FAQ, and demo video. |
| `/sign-in` | Clerk sign-in page. |
| `/sign-up` | Clerk sign-up page. |
| `/onboarding` | User profile setup for industry, experience, bio, and skills. |
| `/dashboard` | Industry insights dashboard for the user's selected industry. |
| `/resume` | Resume builder and ATS resume analysis flow. |
| `/ai-cover-letter` | Cover letter history. |
| `/ai-cover-letter/new` | AI cover letter generator. |
| `/interview` | Interview preparation dashboard with quiz history and charts. |
| `/interview/mock` | Technical quiz interview practice. |
| `/interview/voice` | Live voice mock interview with AI evaluation. |
| `/roadmap` | AI-generated career roadmap with clickable learning topics. |

## API Routes

| Route | Purpose |
| --- | --- |
| `POST /api/roadmap` | Generates React Flow roadmap nodes and edges for a target role. |
| `POST /api/videos` | Finds YouTube tutorials for a selected roadmap topic. |
| `POST /api/interview/audio` | Transcribes audio, generates the next interviewer message, and returns speech audio. |
| `POST /api/extract-pdf` | Extracts text from an uploaded PDF. |
| `/api/inngest` | Exposes Inngest handlers for scheduled jobs. |

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm
- PostgreSQL database
- Clerk project
- OpenAI API key
- Gemini API key

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/onboarding"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

3. Apply database migrations:

```bash
npx prisma migrate dev
```

4. Generate the Prisma client:

```bash
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev      # Start the Next.js development server with Turbopack
npm run build    # Build the production app
npm run start    # Start the production server
npm run lint     # Run the configured lint command
```

The `postinstall` script also runs `prisma generate` after dependencies are installed.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Public Clerk key used by the frontend. |
| `CLERK_SECRET_KEY` | Yes | Secret Clerk key used by server-side auth and user lookup. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Clerk sign-in route. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Clerk sign-up route. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | Redirect target after sign-in. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | Redirect target after sign-up. |
| `OPENAI_API_KEY` | Yes | Powers resume analysis, cover letters, quizzes, roadmaps, voice interviews, transcription, speech, and evaluation. |
| `GEMINI_API_KEY` | Yes | Powers the scheduled Inngest industry insight refresh job. |

## Database Models

The Prisma schema defines these main models:

- `User`: Clerk-linked user profile with industry, bio, experience, skills, resume, assessments, and cover letters.
- `IndustryInsight`: AI-generated salary ranges, growth rate, demand level, top skills, market outlook, trends, and recommended skills for an industry.
- `Resume`: One saved Markdown resume per user, with optional ATS score and feedback fields.
- `Assessment`: Interview quiz result history with question data, score, category, and improvement tips.
- `CoverLetter`: Generated cover letters tied to a company, job title, job description, status, and user.

Use Prisma Studio to inspect local data:

```bash
npx prisma studio
```

## AI Workflow

SensAI uses OpenAI for interactive product features:

- `gpt-5-nano` for industry insights, resume analysis, cover letters, and roadmap generation.
- `gpt-4o-mini` for quiz generation, interview follow-ups, improvement tips, and voice interview evaluation.
- `whisper-1` for audio transcription.
- `tts-1` for interviewer speech output.

The scheduled Inngest job in `lib/inngest/function.js` uses Gemini `gemini-2.5-flash` every Sunday at midnight to refresh saved industry insight records.

## Development Notes

- Protected routes are configured in `middleware.js`.
- The Prisma client is reused during development through `globalThis` in `lib/prisma.js`.
- `next.config.mjs` marks `pdf-parse` and `yt-search` as server external packages.
- The app uses a dark theme by default with `next-themes` and Clerk's dark appearance.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
