"use client";

import { useState, useCallback } from "react";
import { Case, Message } from "@/lib/types";
import { StopCircle } from "lucide-react";
import clsx from "clsx";
import { useDeepgramCall } from "@/hooks/useDeepgramCall";
import CallWindow from "./CallWindow";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface Props {
  case_: Case;
  messages: Message[];
  onSend: (text: string) => Promise<void>;
  onEndEarly: () => void;
  maxTurns: number;
  onCallMessage?: (msg: Message) => void;
}

export default function ChatWindow({ case_, messages, onSend, onEndEarly, maxTurns, onCallMessage }: Props) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleCallMessage = useCallback((msg: Message) => onCallMessage?.(msg), [onCallMessage]);
  const { status, isMuted, startCall, endCall, toggleMute } = useDeepgramCall(case_, handleCallMessage, onEndEarly, maxTurns);

  const agentTurns = messages.filter((m) => m.role === "agent").length;
  const turnsLeft = maxTurns - agentTurns;

  async function handleSend() {
    if (sending || !input.trim() || turnsLeft === 0) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await onSend(text);
    setSending(false);
  }

  if (case_.channel === "Call") {
    return (
      <CallWindow
        case_={case_}
        messages={messages}
        status={status}
        isMuted={isMuted}
        turnsLeft={turnsLeft}
        onStart={startCall}
        onEnd={endCall}
        onToggleMute={toggleMute}
      />
    );
  }

  return (
    <div className="animate-slide-up flex flex-col" style={{ height: "calc(100vh - 180px)", minHeight: 480 }}>
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
        style={{ background: "var(--card)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>C</div>
          <div>
            <p className="text-sm font-semibold">{case_.title}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{case_.topic} · {case_.difficulty}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={clsx("text-xs px-2.5 py-1 rounded-full font-medium", turnsLeft <= 1 ? "text-red-400" : "text-amber-400")}
            style={{ background: turnsLeft <= 1 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)" }}
          >
            {turnsLeft} turn{turnsLeft !== 1 ? "s" : ""} left
          </span>
          <button
            onClick={onEndEarly}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <StopCircle size={13} /> End & Score
          </button>
        </div>
      </div>

      <ChatMessages messages={messages} sending={sending} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={sending}
        turnsLeft={turnsLeft}
      />
    </div>
  );
}