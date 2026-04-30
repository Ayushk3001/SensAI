import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const historyString = formData.get("history") || "[]";
    const history = JSON.parse(historyString);

    const jobDescription = formData.get("jobDescription") || "Software Engineer";
    const resumeText = formData.get("resumeText") || "No resume provided.";
    
    // NEW: Get the interview type selected by the user
    const interviewType = formData.get("interviewType") || "technical";

    // 1. Transcribe audio
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    const userText = transcription.text;

    // 2. Set the rules based on the chosen interview type
    let interviewInstructions = "";

    if (interviewType === "technical") {
      interviewInstructions = `
      PURPOSE: Test technical skills. 
      - Ask about coding concepts which is based on the skill in resume.
      - Ask a Question about Data Structure and Algorithm.
      - Ask problem-solving questions.
      - Ask about system design (basic/advanced depending on their resume).
      - Base the questions heavily on the technologies listed in their resume and the job description.`;
    } 
    else if (interviewType === "hr") {
      interviewInstructions = `
      PURPOSE: Test personality, communication, and cultural fit.
      - Ask them to "Tell me about yourself".
      - Ask about their strengths & weaknesses.
      - Ask them to describe a challenge they faced and how they overcame it.
      - Use STAR-based evaluation (Situation, Task, Action, Result) in your line of questioning.`;
    } 
    else if (interviewType === "aptitude") {
      interviewInstructions = `
      PURPOSE: Test thinking ability and logic.
      - Give them logical puzzles to solve verbally.
      - Ask basic math or sequence reasoning questions (e.g., "Find the next number in the series", "If 3 people take 3 days...").
      - Ask how they approach breaking down a completely unknown problem.`;
    } 
    else if (interviewType === "managerial") {
      interviewInstructions = `
      PURPOSE: Test decision-making and leadership.
      - Ask situational questions: "How would you handle conflict in a team?"
      - Ask: "What would you do if a deadline is missed?"
      - Ask: "How do you prioritize tasks when everything is urgent?"
      - Focus on how they handle stress, teamwork, and project management.`;
    }

    // 3. Create the dynamic system prompt
    const systemPrompt = `
    You are an expert interviewer conducting a live voice interview. 
    Your goal is to evaluate the candidate for the following role:
    ---
    ${jobDescription}
    ---
    Candidate Resume Context:
    ---
    ${resumeText}
    ---

    ### INTERVIEW TYPE INSTRUCTIONS:
    ${interviewInstructions}

    ### OPERATIONAL RULES:
    - **Conciseness:** ALWAYS keep your response under 3 sentences. This is a voice-to-voice interview; long blocks of text are overwhelming.
    - **Conversational Tone:** Use phrases like "That's interesting," "I see," or "Great point" to acknowledge their answer before moving to the next question.
    - **Strict One-at-a-Time:** Never ask two questions in one response. Wait for the candidate to answer before proceeding.
    - **The "Safety Net":** If the candidate is silent or gives a very short answer, gently encourage them to elaborate.
    `;

    // 4. Get AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userText },
      ],
    });
    const aiText = completion.choices[0].message.content;

    // 5. Convert AI Text to Speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx", 
      input: aiText,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString("base64");

    return NextResponse.json({ userText, aiText, audioBase64 });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 },
    );
  }
}
