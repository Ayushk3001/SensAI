"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utility: validate required fields
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

    const prompt = `
Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.

About the candidate:
- Industry: ${user.industry || "N/A"}
- Years of Experience: ${user.experience || "N/A"}
- Skills: ${user.skills?.join(", ") || "N/A"}
- Professional Background: ${user.bio || "N/A"}

Job Description:
${data.jobDescription}

Requirements:
1. Professional and enthusiastic tone
2. Highlight relevant skills and experience
3. Align with company needs
4. Max 400 words
5. Proper business letter format (markdown)
6. Include achievements
7. Relate background to job
`;

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
    });

    const content = response.output_text?.trim();

    if (!content) throw new Error("Empty response from AI");

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
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