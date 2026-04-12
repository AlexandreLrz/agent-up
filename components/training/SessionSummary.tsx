"use client";

import { CaseResult } from "@/lib/types";
import { Trophy, RotateCcw, BarChart2 } from "lucide-react";
import Link from "next/link";

interface Props {
  results: CaseResult[];
  onRestart: () => void;
}

function scoreColor(s: number) {
  if (s >= 75) return "#10b981";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(s: number) {
  if (s >= 80) return "Excellent";
  if (s >= 65) return "Good";
  if (s >= 50) return "Fair";
  return "Needs Work";
}

export default function SessionSummary({ results, onRestart }: Props) {
  const avg = Math.round(results.reduce((a, b) => a + b.score, 0) / results.length);
  const color = scoreColor(avg);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Hero */}
      <div
        className="rounded-2xl p-8 mb-5 text-center"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: `rgba(${color === "#10b981" ? "16,185,129" : color === "#f59e0b" ? "245,158,11" : "239,68,68"},0.15)` }}
        >
          <Trophy size={28} style={{ color }} />
        </div>
        <h1 className="font-display text-3xl font-bold mb-1" style={{ fontWeight: 800 }}>
          Session Complete
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          {results.length} cases completed
        </p>
        <div className="text-6xl font-bold font-display mb-1" style={{ color }}>
          {avg}
        </div>
        <div className="text-sm font-medium" style={{ color }}>
          {scoreLabel(avg)} · Average Score
        </div>
      </div>

      {/* Case results */}
      <div className="space-y-3 mb-5">
        {results.map((r, i) => (
          <div
            key={i}
            className="rounded-xl p-4 animate-slide-up flex items-start gap-4"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 font-display"
              style={{ background: `${scoreColor(r.score)}22`, color: scoreColor(r.score) }}
            >
              {Math.round(r.score)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm mb-1 truncate">{r.caseTitle}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                {r.feedback}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <RotateCcw size={15} />
          New Session
        </button>
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ background: "var(--accent)", color: "white" }}
        >
          <BarChart2 size={15} />
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
