import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const historyString = formData.get("history") || "[]";
    const history = JSON.parse(historyString);

    // Get the newly added context
    const jobDescription =
      formData.get("jobDescription") || "Software Engineer";
    const resumeText = formData.get("resumeText") || "No resume provided.";

    // 1. Transcribe audio
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    const userText = transcription.text;

    // 2. Create a dynamic system prompt based on user inputs
    const systemPrompt = `
    You are an expert technical interviewer conducting a live voice interview. 
    Your goal is to evaluate the candidate's fit for the following role:
    ---
    ${jobDescription}
    ---
    Candidate Resume Context:
    ---
    ${resumeText}
    ---

    ### INTERVIEW PHASE PROTOCOL:
    1. **The Warm-up (Phase 1):** Start with a friendly greeting. Ask one simple "comfort" question to help the fresher settle in (e.g., "How is your day going?" or "Briefly introduce yourself").
    2. **The Fundamentals (Phase 2):** Ask easy, foundational questions based on the skills listed in their resume to build their confidence.
    3. **The Deep Dive (Phase 3):** Gradually increase difficulty. Ask about specific projects or how they would handle a technical challenge related to the job description.
    4. **The Behavioral (Phase 4):** Ask one situational question (e.g., "Tell me about a time you faced a bug you couldn't solve").

    ### OPERATIONAL RULES:
    - **Conciseness:** ALWAYS keep your response under 3 sentences. This is a voice-to-voice interview; long blocks of text are overwhelming.
    - **Conversational Tone:** Use phrases like "That's interesting," "I see," or "Great point" to acknowledge their answer before moving to the next question.
    - **Strict One-at-a-Time:** Never ask two questions in one response. Wait for the candidate to answer before proceeding.
    - **Adaptive Difficulty:** If the candidate struggles significantly, simplify the next question. If they breeze through, increase the technical depth.
    - **The "Safety Net":** If the candidate is silent or gives a very short answer, gently encourage them to elaborate.
    `;

    // 3. Get AI Response
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

    // 4. Convert AI Text to Speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx", // Changed to 'onyx' for a deeper, professional interviewer voice
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
