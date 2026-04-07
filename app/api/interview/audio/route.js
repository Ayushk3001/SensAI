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
    const jobDescription = formData.get("jobDescription") || "Software Engineer";
    const resumeText = formData.get("resumeText") || "No resume provided.";

    // 1. Transcribe audio
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    const userText = transcription.text;

    // 2. Create a dynamic system prompt based on user inputs
    const systemPrompt = `You are a professional technical interviewer for the following job description:
    ---
    ${jobDescription}
    ---
    
    The candidate has provided the following resume:
    ---
    ${resumeText}
    ---
    
    Your task is to conduct a realistic, professional voice interview. 
    Rule 1: Be highly conversational.
    Rule 2: Keep your responses under 3 sentences to simulate a real conversation.
    Rule 3: Ask questions specifically tailored to gaps or alignments between the resume and the job description.
    Rule 4: Wait for the candidate to answer before moving to the next question.`;

    // 3. Get AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150, 
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userText }
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
    const audioBase64 = buffer.toString('base64');

    return NextResponse.json({ userText, aiText, audioBase64 });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
  }
}