"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// NEW: Added 'topic' argument
export async function generateQuiz(topic = "") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  // NEW: Tells the AI to focus on the specific topic if the user typed one in
  const topicInstruction = topic 
    ? `The questions MUST focus heavily on the following specific topic: "${topic}".` 
    : "";

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    ${topicInstruction}
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // FIXED MODEL NAME
      messages: [
        {
          role: "system",
          content: "You are a technical interviewer. Output only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    const quiz = JSON.parse(text);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // FIXED MODEL NAME
        messages: [
          { role: "system", content: "You are a helpful technical mentor." },
          { role: "user", content: improvementPrompt },
        ],
      });

      improvementTip = tipCompletion.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}

export async function getVoiceInterviews() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.voiceInterview.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function deleteVoiceInterview(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  await db.voiceInterview.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/interview/voice");
  revalidatePath("/dashboard");
}

// Voice Interview Evaluation (Includes the dynamic interviewType fixes we made earlier!)
export async function evaluateVoiceInterview(history, jobDescription, interviewType = "technical") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  let evaluationCriteria = "";
  let competencyLabel = "";

  if (interviewType === "technical") {
    evaluationCriteria = "technical accuracy, problem-solving skills, system design, and coding concepts";
    competencyLabel = "Technical Skills";
  } else if (interviewType === "hr") {
    evaluationCriteria = "cultural fit, behavioral alignment, self-awareness, and use of the STAR method";
    competencyLabel = "Behavioral & Cultural Fit";
  } else if (interviewType === "aptitude") {
    evaluationCriteria = "logical reasoning, analytical thinking, mental agility, and mathematical approach";
    competencyLabel = "Logical & Analytical Ability";
  } else if (interviewType === "managerial") {
    evaluationCriteria = "leadership, decision-making, conflict resolution, and task prioritization under stress";
    competencyLabel = "Managerial & Leadership Skills";
  }

  const prompt = `
    You are an expert evaluator for a ${interviewType.toUpperCase()} interview. 
    Review the following transcript of a mock voice interview for the following job description:
    
    Job Description: ${jobDescription}

    Interview Transcript:
    ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

    Evaluate the candidate's performance heavily based on: ${evaluationCriteria}, as well as their general communication clarity.
    
    Return the response in this JSON format ONLY:
    {
      "scores": {
        "competency": <number 1-10>,
        "communication": <number 1-10>,
        "overall": <number 1-10>
      },
      "feedback": "A concise paragraph summarizing their strengths and specific areas for improvement regarding their ${competencyLabel}.",
      "keyMetrics": ["<metric 1>", "<metric 2>", "<metric 3>", "<metric 4>"]
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // FIXED MODEL NAME
      messages: [
        {
          role: "system",
          content: "You are an expert interview evaluator. Output only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" }, 
    });

    const text = completion.choices[0].message.content;
    const result = JSON.parse(text);

    const savedInterview = await db.voiceInterview.create({
      data: {
        userId: user.id,
        jobTitle: "Mock Interview",
        interviewType,
        jobDescription,
        transcript: history,
        scores: result.scores || {},
        feedback: result.feedback || "",
        keyMetrics: result.keyMetrics || [],
        rating: result.scores?.overall || null,
        status: "completed",
      },
    });

    revalidatePath("/interview");
    revalidatePath("/interview/voice");
    revalidatePath("/dashboard");

    return { ...result, id: savedInterview.id, createdAt: savedInterview.createdAt };
  } catch (error) {
    console.error("Error evaluating interview:", error);
    throw new Error("Failed to evaluate interview");
  }
}
