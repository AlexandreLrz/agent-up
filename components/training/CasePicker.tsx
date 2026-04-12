"use client";

import { Case } from "@/lib/types";
import { MessageSquare, Phone, Flame, Play } from "lucide-react";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import TopicBadge from "@/components/ui/TopicBadge";

interface Props {
  case_: Case;
  onStart: () => void;
}

export default function CasePicker({ case_, onStart }: Props) {
  const channelIcon =
    case_.channel === "Call" ? (
      <Phone size={14} />
    ) : (
      <MessageSquare size={14} />
    );

  return (
    <div className="animate-slide-up">
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Top strip */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <TopicBadge topic={case_.topic} />
            <DifficultyBadge difficulty={case_.difficulty} />
          </div>
          <div
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            style={{ background: "var(--surface)", color: "var(--text-muted)" }}
          >
            {channelIcon}
            <span>{case_.channel}</span>
          </div>
        </div>

        <div className="px-6 py-6">
          <h1
            className="font-display text-2xl font-bold mb-3 leading-tight"
            style={{ fontWeight: 700 }}
          >
            {case_.title}
          </h1>

          {/* Scenario */}
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Situation
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              {case_.scenario}
            </p>
          </div>

          {/* Opening message preview */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Customer will open with:
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: "#cbd5e1" }}>
              "{case_.openingMessage}"
            </p>
          </div>

          {/* Tips */}
          <div
            className="rounded-xl p-4 mb-6 flex gap-3"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <Flame size={16} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--warning)" }}>
                Scoring criteria
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                Empathy & tone · Accuracy · Resolution · Professionalism — each worth 25%. You have up to 5 turns.
              </p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <Play size={15} fill="white" />
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}
