import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Initialize OpenAI using your existing key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetRole } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const prompt = `You are an expert technical career coach. Create a learning roadmap for someone who wants to become a "${targetRole}".
    Generate a valid JSON object with two arrays: "nodes" and "edges".
    Nodes represent skills or technologies to learn. Arrange them in a logical top-down flowchart.

    Format strict requirements:
    1. "nodes": Array of objects. Each object MUST have:
       - "id": A unique string (e.g., "1", "2").
       - "position": An object with "x" and "y" numbers. Start y at 0 and increase by 100 for each subsequent step down the path. Stagger x horizontally between 100 and 500 so nodes don't overlap.
       - "data": An object with a "label" string (the specific skill/tool name).
       - "style": {"borderRadius": "8px", "padding": "15px", "width": 200, "textAlign": "center", "fontSize": "15px", "fontWeight": "bold"}
    2. "edges": Array of objects. Each object MUST have:
       - "id": A unique string (e.g., "e1-2").
       - "source": The ID of the parent node.
       - "target": The ID of the child node.
       - "animated": true

    Return ONLY the JSON object. Generate exactly 8 to 12 highly relevant nodes for a complete roadmap.`;

    // Call OpenAI and force it to return strict JSON
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano", 
      response_format: { type: "json_object" }, // This guarantees it won't break your UI
      messages: [
        { role: "system", content: "You are a helpful assistant designed to output strict JSON." },
        { role: "user", content: prompt }
      ]
    });

    // Parse OpenAI's response
    const data = JSON.parse(completion.choices[0].message.content);

    const roadmap = await db.roadmap.create({
      data: {
        userId: user.id,
        targetRole,
        nodes: data.nodes || [],
        edges: data.edges || [],
        completedNodeIds: [],
      },
    });

    return NextResponse.json({ ...data, id: roadmap.id, createdAt: roadmap.createdAt });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
