import { useRef } from "react";
import { Case, Message } from "@/lib/types";
import { Headphones, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import clsx from "clsx";
import { CallStatus } from "@/hooks/useDeepgramCall";
import StatusPill from "./StatusPill";

const STATUS_TEXT: Record<CallStatus, string> = {
  idle:       "Click Start Call to begin. The AI customer will speak to you directly.",
  connecting: "Connecting to Deepgram Voice Agent…",
  live:       "Call in progress. Speak naturally — you have up to 5 agent turns.",
  ended:      "Call ended. Scoring your performance…",
};

type Props = {
  case_: Case;
  messages: Message[];
  status: CallStatus;
  isMuted: boolean;
  turnsLeft: number;
  onStart: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
};

export default function CallWindow({ case_, messages, status, isMuted, turnsLeft, onStart, onEnd, onToggleMute }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div className="animate-slide-up flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="font-semibold text-sm">{case_.title}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {case_.topic} · {case_.difficulty}
            </p>
          </div>
          <StatusPill status={status} />
        </div>

        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <div className="relative">
            <div
              className={clsx("w-24 h-24 rounded-full flex items-center justify-center", status === "live" && "animate-pulse-slow")}
              style={{
                background: status === "live" ? "rgba(239,68,68,0.15)" : "var(--surface)",
                border: `2px solid ${status === "live" ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
              }}
            >
              <Headphones size={36} style={{ color: status === "live" ? "#f87171" : "var(--text-muted)" }} />
            </div>
            {status === "live" && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ background: "#10b981", borderColor: "var(--card)" }}>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </span>
            )}
          </div>

          <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
            {STATUS_TEXT[status]}
          </p>

          <div className="flex items-center gap-3">
            {status === "idle" && (
              <button onClick={onStart} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90" style={{ background: "#10b981", color: "white" }}>
                <Phone size={16} /> Start Call
              </button>
            )}
            {status === "live" && (
              <>
                <button onClick={onToggleMute} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80" style={{ background: isMuted ? "rgba(239,68,68,0.15)" : "var(--surface)", border: "1px solid var(--border)", color: isMuted ? "#f87171" : "var(--text)" }}>
                  {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button onClick={onEnd} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                  <PhoneOff size={15} /> End Call
                </button>
              </>
            )}
          </div>

          {status === "live" && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {turnsLeft} turn{turnsLeft !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
            Live Transcript
          </div>
          <div className="px-4 py-3 space-y-2 max-h-64 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-2 text-sm animate-fade-in">
                <span className="font-semibold flex-shrink-0" style={{ color: msg.role === "agent" ? "var(--accent)" : "#f87171" }}>
                  {msg.role === "agent" ? "You" : "Customer"}:
                </span>
                <span style={{ color: "#94a3b8" }}>{msg.content}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}