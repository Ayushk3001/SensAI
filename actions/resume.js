"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return await db.resume.findUnique({ where: { userId: user.id } });
}

export async function analyzeAndSaveResume(resumeText, jobDescription) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const prompt = `
      You are an expert ATS (Applicant Tracking System) Analyzer and Resume Writer. 
      Analyze the provided Resume against the Job Description.

      TASK:
      1. Calculate an ATS Match Score (0-100).
      2. Identify missing keywords.
      3. Provide specific improvement recommendations.
      4. REWRITE the resume into a tailored Markdown version that fits STRICTLY on ONE PAGE.

      RESUME: ${resumeText}
      JD: ${jobDescription}

      RETURN ONLY A JSON OBJECT:
      {
        "score": number,
        "missingKeywords": ["string"],
        "recommendations": ["string"],
        "tailoredResume": "markdown_string"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "system", content: "You are a professional recruiter." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Save the new tailored version to the database
    await db.resume.upsert({
      where: { userId: user.id },
      update: { content: result.tailoredResume },
      create: { userId: user.id, content: result.tailoredResume },
    });

    revalidatePath("/resume");
    return result;
  } catch (error) {
    throw new Error("Diagnostic failed: " + error.message);
  }
}