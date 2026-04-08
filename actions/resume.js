"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function saveResume(content) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (!content) throw new Error("Content is required");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Save Resume Error:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.resume.findUnique({
      where: { userId: user.id },
    });
  } catch (error) {
    console.error("Get Resume Error:", error);
    throw new Error("Failed to fetch resume");
  }
}

export async function improveWithAI({ current, type }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (!current || !type) {
      throw new Error("Missing required fields");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { industryInsight: true },
    });

    if (!user) throw new Error("User not found");

    const prompt = `
As an expert resume writer, improve the following ${type} description for a ${user.industry || "general"} professional.

Make it impactful, quantifiable, and aligned with industry standards.

Current content:
"${current}"

Requirements:
- Use strong action verbs
- Add measurable results (numbers, %, impact)
- Highlight relevant technical skills
- Focus on achievements, not responsibilities
- Use industry-specific keywords
- Keep it concise

Return ONLY the improved paragraph. No explanations.
`;

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
    });

    const improvedContent = response.output_text?.trim();

    if (!improvedContent) {
      throw new Error("Empty response from AI");
    }

    return improvedContent;
  } catch (error) {
    console.error("Improve Resume Error:", error);
    throw new Error("Failed to improve content");
  }
}