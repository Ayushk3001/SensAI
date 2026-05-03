# SensAI

SensAI is a full-stack AI career coaching platform built with Next.js. It helps users understand their career market, tailor resumes, generate cover letters, practice interviews, build learning roadmaps, and track job applications from saved opportunity to offer.

The app combines an authenticated career workspace, AI document generation, interview analytics, voice-based mock interviews, roadmap visualization, and a complete job tracker that connects applications with generated resume versions and cover letters.

## Core Functionality

- Clerk authentication with protected routes for the dashboard, onboarding, resume tools, cover letters, job tracker, interview prep, voice interviews, and roadmaps.
- User onboarding for industry, specialization, experience, bio, and skills.
- AI-generated industry insights with salary ranges, growth rate, demand level, market outlook, key trends, top skills, and recommended skills.
- Career dashboard that brings together market signals, resume scores, voice interview readiness, roadmap progress, active job counts, and application pipeline status.
- Resume Studio for PDF resume extraction, ATS scoring, missing keyword detection, recommendations, one-page tailored Markdown resumes, copy-to-clipboard output, saved versions, and score history.
- AI Cover Letter Studio for resume-aware, job-specific cover letters using company name, job title, job description, and uploaded resume context.
- Job Tracker for managing applications, status changes, job links, locations, notes, attached resume versions, attached cover letters, and pipeline counts.
- Technical quiz interview practice with AI-generated multiple-choice questions, scoring, saved assessment history, explanations, and improvement tips.
- Voice mock interviews for technical, HR/behavioral, aptitude, and managerial rounds with PDF resume context, job description context, live audio recording, transcription, spoken AI follow-ups, and final AI evaluation.
- Career Roadmaps with AI-generated React Flow learning paths, saved roadmap history, progress tracking, completed milestones, fullscreen canvas controls, and YouTube tutorial recommendations for selected topics.
- Weekly Inngest background job that refreshes saved industry insight records with Gemini.
- Dark/light theme support, responsive UI, reusable shadcn-style components, and a Growth Tools navigation menu.

## Feature Modules

### Authentication and Onboarding

- Clerk handles sign-in, sign-up, user sessions, and user menu actions.
- `middleware.js` protects career workspace routes.
- `checkUser` creates or syncs the local Prisma user record.
- Onboarding stores industry, sub-industry, experience, bio, and skills.
- New users are redirected to onboarding before entering the dashboard.

### Career Dashboard

- Shows a career snapshot across resume, voice interviews, roadmaps, job applications, and market data.
- Displays latest resume ATS score and saved resume version count.
- Displays average voice interview readiness score and recent voice interview trend.
- Displays roadmap completion percentage.
- Displays active job applications and application counts by pipeline status.
- Shows salary range charts, market outlook, demand level, top skills, recommended skills, and key industry trends.

### Resume Studio

- Upload or drag-and-drop a PDF resume.
- Extract resume text in the browser with `react-pdftotext`.
- Paste a target job description.
- Generate an ATS match score, missing keywords, improvement recommendations, and a tailored one-page Markdown resume.
- Save each tailored resume as a `ResumeVersion`.
- Maintain a latest `Resume` record for the user.
- Review average, latest, and best ATS scores.
- View saved resume version history.
- Delete saved resume versions.
- Copy the generated Markdown resume.

### Cover Letter Studio

- Upload a PDF resume.
- Enter company name, job title, and job description.
- Generate a professional Markdown cover letter using resume/profile context.
- Save generated cover letters to the user's history.
- View individual cover letters by company and role.
- Delete old cover letters.
- Attach saved cover letters to job tracker applications.

### Job Tracker

- Track real job applications from `/job-tracker`.
- Create applications with company name, job title, status, location, job URL, and notes.
- Use pipeline statuses: `saved`, `applied`, `interviewing`, `offer`, `rejected`, and `archived`.
- View status cards that count applications in each stage.
- Update application status directly from each job card.
- Open original job posts from saved job URLs.
- Attach saved tailored resume versions and generated cover letters to applications.
- Delete tracked applications with confirmation.
- Store tracker records in the `JobApplication` Prisma model, scoped to the authenticated user.
- Update dashboard active job counts and pipeline status summaries automatically.
- Detach linked applications safely when a saved resume version is deleted.

### Interview Prep

- Generate 10 technical interview questions based on the user's industry and skills.
- Optionally focus quiz generation on a selected topic.
- Answer multiple-choice questions and receive score results.
- Save each assessment with questions, correct answers, user answers, explanations, and score.
- Generate short AI improvement tips from incorrect answers.
- Review assessment history and performance charts.

### Voice Interviews

- Choose an interview type: technical, HR/behavioral, aptitude, or managerial.
- Upload a resume PDF and paste the target job description.
- Speak answers through the browser microphone.
- Transcribe candidate audio with OpenAI Whisper.
- Generate concise AI interviewer follow-ups.
- Convert AI follow-ups to speech.
- Require at least four candidate answers before final scoring.
- Evaluate transcript quality with competency, communication, and overall scores.
- Save completed voice sessions with transcript, scores, feedback, key metrics, rating, and interview type.
- Review voice interview history and delete saved sessions.

### Career Roadmaps

- Generate a role-based learning roadmap with 8 to 12 skill nodes.
- Visualize roadmaps with React Flow nodes, edges, controls, minimap, and fullscreen mode.
- Use quick role suggestions such as Software Engineer, Product Manager, Data Scientist, UX Designer, DevOps Engineer, and AI Engineer.
- Click roadmap nodes to fetch recommended YouTube tutorials.
- Mark nodes complete and persist progress.
- View saved roadmap history, average progress, and completed node counts.
- Delete saved roadmaps.

## Tech Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS
- Radix UI primitives and shadcn-style components
- Clerk authentication
- Prisma ORM with PostgreSQL
- OpenAI SDK for AI career workflows, resume analysis, cover letters, quizzes, roadmaps, transcription, speech, and interview evaluation
- Google Gemini for scheduled industry insight refreshes
- Inngest for background jobs
- React Flow for roadmap visualization
- Recharts for dashboard, resume, and interview analytics
- `react-pdftotext` and `pdf-parse` for PDF extraction
- `yt-search` for roadmap tutorial recommendations
- Sonner for toast notifications
- Zod and React Hook Form for form validation

## Project Structure

```text
actions/              Server actions for users, dashboard data, resumes, cover letters, job tracker, interviews, and roadmaps
app/                  Next.js App Router pages, layouts, API routes, route groups, and feature screens
components/           Shared UI components, header, auth actions, growth dropdown, hero, theme provider, and delete confirmation
data/                 Landing page content, FAQs, features, industries, testimonials, and process steps
hooks/                Reusable client hooks
lib/                  Prisma client, Clerk user helper, utilities, and Inngest setup
prisma/               Prisma schema and database migrations
public/               Logo, banner images, landing animations, favicon, and static assets
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with product overview, features, testimonials, FAQ, and visual demo assets. |
| `/sign-in` | Clerk sign-in page. |
| `/sign-up` | Clerk sign-up page. |
| `/onboarding` | User profile setup for industry, specialization, experience, bio, and skills. |
| `/dashboard` | Career command center with industry insights, resume score, voice interview trend, roadmap progress, and job pipeline data. |
| `/resume` | Resume Studio dashboard with ATS score stats and saved resume versions. |
| `/resume/build` | PDF resume upload, ATS analysis, and AI-tailored resume generation. |
| `/ai-cover-letter` | Cover Letter Studio history. |
| `/ai-cover-letter/new` | AI cover letter generator. |
| `/ai-cover-letter/[id]` | Saved cover letter preview. |
| `/job-tracker` | Application pipeline tracker with statuses, job details, notes, job links, resume attachments, and cover letter attachments. |
| `/interview` | Interview preparation dashboard with quiz history, stats, and charts. |
| `/interview/mock` | AI-generated technical quiz practice. |
| `/interview/voice` | Voice interview dashboard and saved speaking-session history. |
| `/interview/voice/practice` | Live voice mock interview setup, recording, conversation, and evaluation flow. |
| `/roadmap` | Career roadmap dashboard with saved paths and progress stats. |
| `/roadmap/new` | AI roadmap builder with React Flow canvas, completion tracking, and YouTube tutorial recommendations. |

## API Routes

| Route | Purpose |
| --- | --- |
| `POST /api/roadmap` | Generates and saves React Flow roadmap nodes and edges for a target role. |
| `POST /api/videos` | Finds YouTube tutorials for a selected roadmap topic. |
| `POST /api/interview/audio` | Transcribes candidate audio, generates the next interviewer message, and returns speech audio. |
| `POST /api/extract-pdf` | Extracts text from an uploaded PDF with server-side `pdf-parse`. |
| `/api/inngest` | Exposes Inngest handlers for scheduled background jobs. |

## Server Actions

| File | Responsibility |
| --- | --- |
| `actions/user.js` | Onboarding updates and onboarding status checks. |
| `actions/dashboard.js` | Industry insight generation and career dashboard data aggregation. |
| `actions/resume.js` | Resume lookup, resume version history, resume version deletion, and ATS analysis/tailoring. |
| `actions/cover-letter.js` | Cover letter generation, listing, lookup, and deletion. |
| `actions/job-tracker.js` | Job tracker data loading, application creation, status updates, full updates, and deletion. |
| `actions/interview.js` | Quiz generation, quiz result saving, assessment history, voice interview history, deletion, and evaluation. |
| `actions/roadmap.js` | Roadmap history, single-roadmap lookup, progress updates, and deletion. |

## Database Models

The Prisma schema defines these main models:

- `User`: Clerk-linked profile with email, name, image, industry, bio, experience, skills, and relations to all career records.
- `IndustryInsight`: Salary ranges, growth rate, demand level, market outlook, top skills, key trends, recommended skills, and update timestamps.
- `Resume`: Latest saved Markdown resume for a user.
- `ResumeVersion`: Historical tailored resumes with job description, ATS score, missing keywords, recommendations, and Markdown content.
- `CoverLetter`: Generated cover letters tied to company name, job title, job description, status, and user.
- `Assessment`: Technical quiz result history with question data, score, category, and AI improvement tip.
- `VoiceInterview`: Saved voice mock interview transcript, scores, feedback, key metrics, rating, type, and status.
- `Roadmap`: Saved learning roadmap with target role, nodes, edges, and completed node IDs.
- `JobApplication`: Job tracker applications with company, role, status, location, URL, notes, linked resume version, linked cover letter, applied date, and timestamps.

Use Prisma Studio to inspect local data:

```bash
npx prisma studio
```

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
npm run lint     # Run ESLint
```

The `postinstall` script runs `prisma generate` after dependencies are installed.

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
| `OPENAI_API_KEY` | Yes | Powers industry insights, resume analysis, cover letters, quizzes, roadmaps, voice interviews, transcription, speech, and evaluation. |
| `GEMINI_API_KEY` | Yes | Powers the scheduled Inngest industry insight refresh job. |

## AI Workflow

SensAI uses OpenAI for interactive product features:

- `gpt-5-nano` for industry insights, resume analysis, cover letter generation, and roadmap generation.
- `gpt-4o-mini` for quiz generation, quiz improvement tips, voice interview follow-ups, and voice interview evaluation.
- `whisper-1` for audio transcription.
- `tts-1` for interviewer speech output.

The scheduled Inngest job in `lib/inngest/function.js` uses Gemini `gemini-2.5-flash` every Sunday at midnight to refresh saved industry insight records.

## Development Notes

- Protected routes are configured in `middleware.js`, including `/job-tracker`.
- The authenticated user's local profile is checked from the header through `checkUser`.
- The Prisma client is reused during development through `globalThis` in `lib/prisma.js`.
- `next.config.mjs` marks `pdf-parse` and `yt-search` as server external packages.
- `app/globals.css` defines shared theme tokens, dashboard utilities, animation helpers, and job status badge classes.
- The app uses `next-themes` and Clerk dark appearance support.
- Job tracker mutations revalidate `/job-tracker` and `/dashboard` so pipeline data stays current.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
