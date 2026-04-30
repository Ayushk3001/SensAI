-- Extend the existing production tables and add the new tracker/history tables.
-- VoiceInterview and Roadmap already exist in the live database from
-- 20260419141249_add_voice_and_roadmap_sessions.

CREATE TABLE IF NOT EXISTS "ResumeVersion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "jobDescription" TEXT,
    "atsScore" DOUBLE PRECISION,
    "missingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "JobApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'saved',
    "location" TEXT,
    "jobUrl" TEXT,
    "notes" TEXT,
    "resumeVersionId" TEXT,
    "coverLetterId" TEXT,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "VoiceInterview"
  ADD COLUMN IF NOT EXISTS "jobDescription" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "scores" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "keyMetrics" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "VoiceInterview"
  ALTER COLUMN "jobTitle" SET DEFAULT 'Mock Interview',
  ALTER COLUMN "status" SET DEFAULT 'completed';

ALTER TABLE "Roadmap"
  ADD COLUMN IF NOT EXISTS "completedNodeIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS "ResumeVersion_userId_idx" ON "ResumeVersion"("userId");
CREATE INDEX IF NOT EXISTS "ResumeVersion_createdAt_idx" ON "ResumeVersion"("createdAt");
CREATE INDEX IF NOT EXISTS "VoiceInterview_interviewType_idx" ON "VoiceInterview"("interviewType");
CREATE INDEX IF NOT EXISTS "VoiceInterview_createdAt_idx" ON "VoiceInterview"("createdAt");
CREATE INDEX IF NOT EXISTS "Roadmap_createdAt_idx" ON "Roadmap"("createdAt");
CREATE INDEX IF NOT EXISTS "JobApplication_userId_idx" ON "JobApplication"("userId");
CREATE INDEX IF NOT EXISTS "JobApplication_status_idx" ON "JobApplication"("status");
CREATE INDEX IF NOT EXISTS "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ResumeVersion_userId_fkey'
  ) THEN
    ALTER TABLE "ResumeVersion"
      ADD CONSTRAINT "ResumeVersion_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'JobApplication_userId_fkey'
  ) THEN
    ALTER TABLE "JobApplication"
      ADD CONSTRAINT "JobApplication_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
