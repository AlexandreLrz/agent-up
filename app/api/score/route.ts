import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, scenario, difficulty } = await req.json();

  const transcript = messages
    .map(
      (m: { role: string; content: string }) =>
        `${m.role === "agent" ? "AGENT" : "CUSTOMER"}: ${m.content}`
    )
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert call centre trainer. Respond only with valid JSON, no extra text.",
        },
        {
          role: "user",
          content: `CUSTOMER SCENARIO:
${scenario}

DIFFICULTY: ${difficulty}

TRANSCRIPT:
${transcript}

Score the agent on each criterion from 0–100, then compute a weighted total:
- empathy (Empathy & Tone): 25%
- accuracy (Accuracy of Information): 25%
- resolution (Resolution / Next Step Given): 25%
- professionalism (Professionalism & Clarity): 25%

Respond ONLY with this JSON:
{
  "empathy": <number 0-100>,
  "accuracy": <number 0-100>,
  "resolution": <number 0-100>,
  "professionalism": <number 0-100>,
  "total": <weighted average 0-100>,
  "feedback": "<2-3 sentences: one strength, one area to improve>"
}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      empathy: 50,
      accuracy: 50,
      resolution: 50,
      professionalism: 50,
      total: 50,
      feedback: "The AI was unable to score this session. Please try again.",
    });
  }
}