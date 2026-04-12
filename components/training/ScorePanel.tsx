"use client";

import { Case, ScoreBreakdown } from "@/lib/types";
import { ChevronRight, Loader2 } from "lucide-react";

interface Props {
  case_: Case;
  score: { breakdown: ScoreBreakdown; total: number; feedback: string } | null;
  loading: boolean;
  onNext: () => void;
  isLast: boolean;
}

const CRITERIA = [
  { key: "empathy", label: "Empathy & Tone" },
  { key: "accuracy", label: "Accuracy" },
  { key: "resolution", label: "Resolution" },
  { key: "professionalism", label: "Professionalism" },
] as const;

function scoreColor(s: number) {
  if (s >= 75) return "#10b981";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="text-center">
        <div className="text-3xl font-bold font-display" style={{ color }}>{score}</div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>/100</div>
      </div>
    </div>
  );
}

export default function ScorePanel({ case_, score, loading, onNext, isLast }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent)" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          AI is scoring your performance…
        </p>
      </div>
    );
  }

  if (!score) return null;

  const glowClass =
    score.total >= 75 ? "score-glow-high" : score.total >= 50 ? "score-glow-mid" : "score-glow-low";

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header card */}
      <div
        className={`rounded-2xl p-6 flex flex-col items-center gap-4 ${glowClass}`}
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          {case_.title}
        </p>
        <ScoreRing score={Math.round(score.total)} />
        <p className="text-center text-sm leading-relaxed max-w-md" style={{ color: "#94a3b8" }}>
          {score.feedback}
        </p>
      </div>

      {/* Breakdown */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Score Breakdown
        </p>
        <div className="space-y-3">
          {CRITERIA.map(({ key, label }, i) => {
            const val = score.breakdown[key];
            const color = scoreColor(val);
            return (
              <div key={key} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{label}</span>
                  <span className="text-sm font-mono font-medium" style={{ color }}>{val}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${val}%`, background: color, transitionDelay: `${i * 80}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: "var(--accent)", color: "white" }}
      >
        {isLast ? "See Session Summary" : "Next Case"}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
