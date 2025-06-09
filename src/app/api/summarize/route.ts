import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// src/app/api/summarize/route.ts

// IMPORTANT: Use the non-public environment variable here
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    // --- RISK MITIGATION: Input Validation ---
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: "Invalid content provided." }, { status: 400 });
    }
    if (content.length > 5000) { // Enforce a character limit
        return NextResponse.json({ error: "Note is too long to summarize." }, { status: 413 });
    }
    // --- END RISK MITIGATION ---

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an assistant that summarizes notes into concise bullet points." },
        { role: "user", content: `Please summarize the following note:\n\n${content}` }
      ],
      temperature: 0.5,
    });

    const summary = completion.choices[0]?.message?.content || "Could not generate summary.";
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Summarization API Error:", error);
    return NextResponse.json({ error: "Failed to summarize note." }, { status: 500 });
  }
}