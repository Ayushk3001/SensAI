import { NextResponse } from "next/server";
import { createRequire } from "module";

// Create a native Node.js require function that Turbopack cannot touch
const require = createRequire(import.meta.url);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Load the library natively, bypassing all Next.js ESM wrapping
    const pdfParse = require("pdf-parse");
    
    // Extract the text
    const data = await pdfParse(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json({ error: "Failed to parse PDF: " + error.message }, { status: 500 });
  }
}