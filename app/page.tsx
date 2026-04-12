"use client";

import { useTrainingSession } from "@/hooks/useTrainingSession";
import SessionProgress from "@/components/training/SessionProgress";
import CasePicker from "@/components/training/CasePicker";
import ScorePanel from "@/components/training/ScorePanel";
import SessionSummary from "@/components/training/SessionSummary";
import ChatWindow from "@/components/training/ChatWindow/ChatWindow";

export default function TrainingPage() {
  const {
    currentCase, dailyCases, currentIndex, phase,
    messages, results, scoring, currentScore,
    startSession, handleAgentSend, scoreConversation,
    handleNext, restartSession, addCallMessage,
  } = useTrainingSession();

  if (phase === "summary") {
    return <SessionSummary results={results} onRestart={restartSession} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {dailyCases.length > 0 && (
        <SessionProgress
          dailyCases={dailyCases}
          currentIndex={currentIndex}
          phase={phase}
        />
      )}

      {phase === "pick" && currentCase && (
        <CasePicker case_={currentCase} onStart={startSession} />
      )}

      {phase === "chat" && currentCase && (
        <ChatWindow
          case_={currentCase}
          messages={messages}
          onSend={handleAgentSend}
          onEndEarly={scoreConversation}
          maxTurns={5}
          onCallMessage={addCallMessage}
        />
      )}

      {phase === "score" && currentCase && (
        <ScorePanel
          case_={currentCase}
          score={currentScore}
          loading={scoring}
          onNext={handleNext}
          isLast={currentIndex + 1 >= dailyCases.length}
        />
      )}
    </div>
  );
}