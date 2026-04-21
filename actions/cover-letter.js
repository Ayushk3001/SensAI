"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function validateInput(data) {
  if (!data?.jobTitle || !data?.companyName || !data?.jobDescription) {
    throw new Error("Missing required fields");
  }
}

export async function generateCoverLetter(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    validateInput(data);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Priority: 1. Uploaded Resume Text, 2. Profile Bio, 3. Default N/A
    const candidateContext = data.resumeText || user.bio || "N/A";

    const prompt = `
Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.

About the candidate (from provided resume/profile):
${candidateContext}

Candidate Skills: ${user.skills?.join(", ") || "N/A"}

Job Description:
${data.jobDescription}

Requirements:
1. Professional and enthusiastic tone.
2. Highlight relevant skills and experience from the candidate's context.
3. Align candidate achievements with specific company needs mentioned in the JD.
4. Max 400 words in proper business letter markdown format.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach writing high-conversion cover letters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content?.trim();

    if (!content) throw new Error("Empty response from AI");

    return await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Generate Cover Letter Error:", error);
    throw new Error(error.message || "Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.coverLetter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Get Cover Letters Error:", error);
    throw new Error("Failed to fetch cover letters");
  }
}

export async function getCoverLetter(id) {
  try {
    if (!id) throw new Error("Missing ID");

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!coverLetter) throw new Error("Cover letter not found");

    return coverLetter;
  } catch (error) {
    console.error("Get Cover Letter Error:", error);
    throw new Error("Failed to fetch cover letter");
  }
}

export async function deleteCoverLetter(id) {
  try {
    if (!id) throw new Error("Missing ID");

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.coverLetter.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Delete Cover Letter Error:", error);
    throw new Error("Failed to delete cover letter");
  }
}