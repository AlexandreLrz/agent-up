const difficultyGuide: Record<string, string> = {
  Beginner:
    "You are polite, patient, and cooperative. You are frustrated but remain calm and reasonable.",
  Intermediate:
    "You are clearly irritated and somewhat impatient. You may repeat your complaint if you feel unheard.",
  Advanced:
    "You are angry, adversarial, and hard to satisfy. You threaten escalation and will only calm down if the agent is genuinely helpful.",
};

export function buildDeepgramSettings(scenario: string, difficulty: string, openingMessage: string) {
  return {
    type: "Settings",
    audio: {
      input: { encoding: "linear16", sample_rate: 16000 },
      output: { encoding: "linear16", sample_rate: 16000, container: "none" },
    },
    agent: {
      language: "en",
      listen: {
        provider: { type: "deepgram", model: "nova-3" },
      },
      think: {
        provider: { type: "open_ai", model: "gpt-4o-mini" },
        prompt: `You are playing the role of a customer calling a phone support line.

CUSTOMER SITUATION:
${scenario}

BEHAVIOUR:
${difficultyGuide[difficulty] || difficultyGuide["Intermediate"]}

STRICT RULES:
- Stay fully in character as the customer. Never break character.
- Never offer solutions — you are the customer, not the agent.
- Keep replies concise (2–4 sentences).
- React authentically: soften if agent is empathetic, escalate if dismissed.
- If the agent resolves your issue satisfactorily, thank them and say goodbye.`,
      },
      speak: {
        provider: { type: "deepgram", model: "aura-2-thalia-en" },
      },
      greeting: openingMessage,
    },
  };
}