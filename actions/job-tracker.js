"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const STATUSES = new Set([
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "archived",
]);

async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return user;
}

function normalizeApplication(data) {
  if (!data?.companyName || !data?.jobTitle) {
    throw new Error("Company and job title are required");
  }

  const status = STATUSES.has(data.status) ? data.status : "saved";

  return {
    companyName: data.companyName.trim(),
    jobTitle: data.jobTitle.trim(),
    status,
    location: data.location?.trim() || null,
    jobUrl: data.jobUrl?.trim() || null,
    notes: data.notes?.trim() || null,
    resumeVersionId: data.resumeVersionId || null,
    coverLetterId: data.coverLetterId || null,
    appliedAt: status === "applied" && !data.appliedAt ? new Date() : data.appliedAt ? new Date(data.appliedAt) : null,
  };
}

export async function getJobTrackerData() {
  const user = await getCurrentUser();

  const [applications, resumeVersions, coverLetters] = await Promise.all([
    db.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    }),
    db.resumeVersion.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.coverLetter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return { applications, resumeVersions, coverLetters };
}

export async function createJobApplication(data) {
  const user = await getCurrentUser();
  const payload = normalizeApplication(data);

  const application = await db.jobApplication.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });

  revalidatePath("/job-tracker");
  revalidatePath("/dashboard");

  return application;
}

export async function updateJobApplication(id, data) {
  const user = await getCurrentUser();
  const payload = normalizeApplication(data);

  await db.jobApplication.updateMany({
    where: { id, userId: user.id },
    data: payload,
  });

  revalidatePath("/job-tracker");
  revalidatePath("/dashboard");
}

export async function updateJobApplicationStatus(id, status) {
  const user = await getCurrentUser();
  if (!STATUSES.has(status)) throw new Error("Invalid status");

  await db.jobApplication.updateMany({
    where: { id, userId: user.id },
    data: {
      status,
      appliedAt: status === "applied" ? new Date() : undefined,
    },
  });

  revalidatePath("/job-tracker");
  revalidatePath("/dashboard");
}

export async function deleteJobApplication(id) {
  const user = await getCurrentUser();

  await db.jobApplication.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/job-tracker");
  revalidatePath("/dashboard");
}
