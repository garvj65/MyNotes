// /lib/groq.ts

export async function summarizeNote(content: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY!}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // or whatever model is available
      messages: [
        {
          role: "system",
          content: "You are an assistant that summarizes notes into concise bullet points.",
        },
        {
          role: "user",
          content: `Please summarize the following note:\n\n${content}`,
        },
      ],
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Groq API Error:", err);
    throw new Error(`Groq API request failed: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
