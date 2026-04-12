import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, scenario, difficulty, channel } = await req.json();

  const difficultyGuide: Record<string, string> = {
    Beginner:
      "You are polite, patient, and cooperative. You are frustrated but remain calm and reasonable.",
    Intermediate:
      "You are clearly irritated and somewhat impatient. You may repeat your complaint if you feel unheard, but you remain open to a proper solution.",
    Advanced:
      "You are angry, adversarial, and hard to satisfy. You push back on answers, threaten escalation (reviews, management, legal), and will only calm down if the agent demonstrates genuine empathy and provides concrete solutions.",
  };

  const systemPrompt = `You are playing the role of a customer contacting a ${
    channel === "Call" ? "phone support line" : "live chat support service"
  }.

CUSTOMER SITUATION:
${scenario}

BEHAVIOUR:
${difficultyGuide[difficulty] || difficultyGuide["Intermediate"]}

STRICT RULES:
- Stay fully in character as the customer at all times. Never break the fourth wall.
- Never offer solutions yourself — you are the customer, not the agent.
- React authentically to what the agent says. If they're empathetic and helpful, soften slightly. If they're dismissive or robotic, escalate.
- Keep your replies concise (2–4 sentences max). Real customers don't write essays.
- Do NOT start with pleasantries like "Of course!" or "Certainly!".
- If the agent has provided a satisfying resolution, you may indicate you're happy and say goodbye to naturally end the conversation.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === "agent" ? "user" : "assistant",
          content: m.content,
        })),
      ],
    }),
  });

  const data = await response.json();
  const text =
    data.choices?.[0]?.message?.content ||
    "I'm sorry, something went wrong on my end.";

  return NextResponse.json({ message: text });
}