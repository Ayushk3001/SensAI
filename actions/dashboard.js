"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIInsights = async (industry) => {
  try {
    if (!industry) throw new Error("Industry is required");

    const prompt = `
Analyze the current state of the ${industry} industry.

Return ONLY valid JSON in this exact format:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

Rules:
- No markdown
- No explanation
- Minimum 5 roles in salaryRanges
- Minimum 5 skills & trends
- Growth rate must be a percentage number (e.g., 12.5)
`;

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
    });

    let text = response.output_text?.trim();

    if (!text) throw new Error("Empty AI response");

    // 🧠 Clean common JSON issues (very important)
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🛡️ Safe JSON parse
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("JSON Parse Error:", text);
      throw new Error("Invalid JSON from AI");
    }

    return parsed;
  } catch (error) {
    console.error("Generate AI Insights Error:", error);
    throw new Error("Failed to generate insights");
  }
};

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { industryInsight: true },
    });

    if (!user) throw new Error("User not found");

    // Generate if not exists
    if (!user.industryInsight) {
      const insights = await generateAIInsights(user.industry);

      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          salaryRanges: insights.salaryRanges,
          growthRate: insights.growthRate,
          demandLevel: insights.demandLevel,
          topSkills: insights.topSkills,
          marketOutlook: insights.marketOutlook,
          keyTrends: insights.keyTrends,
          recommendedSkills: insights.recommendedSkills,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return industryInsight;
    }

    return user.industryInsight;
  } catch (error) {
    console.error("Get Industry Insights Error:", error);
    throw new Error("Failed to fetch industry insights");
  }
}