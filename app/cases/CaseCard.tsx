"use client";

import { Case, Channel } from "@/lib/types";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import TopicBadge from "@/components/ui/TopicBadge";
import { MessageSquare, Phone, Lock, ChevronDown, Trash2 } from "lucide-react";

type Props = {
  case_: Case;
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  index: number;
};

function channelIcon(ch: Channel) {
  return ch === "Call" ? <Phone size={12} /> : <MessageSquare size={12} />;
}

export default function CaseCard({ case_: c, expanded, onToggle, onDelete, index }: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden animate-slide-up"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        animationDelay: `${index * 40}ms`,
      }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <TopicBadge topic={c.topic} />
          <span className="text-sm font-medium truncate">{c.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DifficultyBadge difficulty={c.difficulty} />
          <div
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--surface)", color: "var(--text-muted)" }}
          >
            {channelIcon(c.channel)}
            <span>{c.channel}</span>
          </div>
          {c.isDefault && (
            <div title="Default case" style={{ color: "var(--text-muted)" }}>
              <Lock size={12} />
            </div>
          )}
          <ChevronDown
            size={14}
            style={{
              color: "var(--text-muted)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </button>

      {expanded && (
        <div
          className="px-4 pb-4 animate-fade-in"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="pt-3 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                Situation
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{c.scenario}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                Opening Message
              </p>
              <p className="text-sm italic leading-relaxed" style={{ color: "#cbd5e1" }}>
                "{c.openingMessage}"
              </p>
            </div>
            {!c.isDefault && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onDelete(c.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}