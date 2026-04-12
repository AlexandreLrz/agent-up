"use client";

import { useState, useEffect, useRef } from "react";
import { Case, Message, CaseResult, Session, ScoreBreakdown } from "@/lib/types";
import { getCases, pickDailySession, saveSession } from "@/lib/storage";

export type Phase = "pick" | "chat" | "score" | "summary";

export type CurrentScore = {
  breakdown: ScoreBreakdown;
  total: number;
  feedback: string;
};

export function useTrainingSession() {
  const [cases, setCases] = useState<Case[]>([]);
  const [dailyCases, setDailyCases] = useState<Case[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("pick");
  const [messages, setMessages] = useState<Message[]>([]);
  const [results, setResults] = useState<CaseResult[]>([]);
  const [scoring, setScoring] = useState(false);
  const [currentScore, setCurrentScore] = useState<CurrentScore | null>(null);

  const messagesRef = useRef<Message[]>([]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    const all = getCases();
    setCases(all);
    setDailyCases(pickDailySession(all, 3));
  }, []);

  const currentCase = dailyCases[currentIndex];

  function startSession() {
    if (!currentCase) return;
    if (currentCase.channel === "Call") {
      setMessages([]);
      messagesRef.current = [];
    } else {
      const opening: Message = {
        role: "customer",
        content: currentCase.openingMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([opening]);
      messagesRef.current = [opening];
    }
    setPhase("chat");
  }

  async function handleAgentSend(text: string) {
    const updated: Message[] = [
      ...messages,
      { role: "agent", content: text, timestamp: new Date().toISOString() },
    ];
    setMessages(updated);

    if (updated.filter((m) => m.role === "agent").length >= 5) {
      await scoreConversation(updated);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          scenario: currentCase.scenario,
          difficulty: currentCase.difficulty,
          channel: currentCase.channel,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: "customer",
        content: data.message,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      console.error("Chat API error");
    }
  }

  async function scoreConversation(msgs: Message[]) {
    setScoring(true);
    setPhase("score");
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          scenario: currentCase.scenario,
          difficulty: currentCase.difficulty,
        }),
      });
      const data = await res.json();
      setCurrentScore({
        breakdown: {
          empathy: data.empathy,
          accuracy: data.accuracy,
          resolution: data.resolution,
          professionalism: data.professionalism,
        },
        total: data.total,
        feedback: data.feedback,
      });
    } catch {
      setCurrentScore({
        breakdown: { empathy: 50, accuracy: 50, resolution: 50, professionalism: 50 },
        total: 50,
        feedback: "Scoring unavailable. Please try again.",
      });
    } finally {
      setScoring(false);
    }
  }

  function handleNext() {
    if (!currentScore) return;

    const result: CaseResult = {
      caseId: currentCase.id,
      caseTitle: currentCase.title,
      topic: currentCase.topic,
      channel: currentCase.channel,
      score: currentScore.total,
      breakdown: currentScore.breakdown,
      feedback: currentScore.feedback,
      messages,
      completedAt: new Date().toISOString(),
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex + 1 >= dailyCases.length) {
      const session: Session = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        cases: newResults,
        averageScore: Math.round(newResults.reduce((a, b) => a + b.score, 0) / newResults.length),
      };
      saveSession(session);
      setPhase("summary");
    } else {
      setCurrentIndex((i) => i + 1);
      setMessages([]);
      messagesRef.current = [];
      setCurrentScore(null);
      setPhase("pick");
    }
  }

  function restartSession() {
    const all = getCases();
    setCases(all);
    setDailyCases(pickDailySession(all, 3));
    setCurrentIndex(0);
    setPhase("pick");
    setMessages([]);
    messagesRef.current = [];
    setResults([]);
    setCurrentScore(null);
  }

  return {
    currentCase,
    dailyCases,
    currentIndex,
    phase,
    messages,
    results,
    scoring,
    currentScore,
    startSession,
    handleAgentSend,
    scoreConversation: () => scoreConversation(messagesRef.current),
    handleNext,
    restartSession,
    addCallMessage: (msg: Message) => setMessages((prev) => [...prev, msg]),
  };
}