import { Phase } from "@/hooks/useTrainingSession";
import { Case } from "@/lib/types";
import { Zap } from "lucide-react";

type Props = {
  dailyCases: Case[];
  currentIndex: number;
  phase: Phase;
};

export default function SessionProgress({ dailyCases, currentIndex, phase }: Props) {
  const progress = ((currentIndex + (phase === "score" ? 1 : 0)) / dailyCases.length) * 100;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-medium font-display" style={{ color: "var(--accent)" }}>
            Daily Training Session
          </span>
        </div>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {currentIndex + 1} / {dailyCases.length}
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ background: "var(--accent)", width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2 mt-3">
        {dailyCases.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{
              background: i < currentIndex ? "rgba(16,185,129,0.15)" : i === currentIndex ? "rgba(59,130,246,0.15)" : "var(--card)",
              border: `1px solid ${i < currentIndex ? "rgba(16,185,129,0.4)" : i === currentIndex ? "rgba(59,130,246,0.4)" : "var(--border)"}`,
              color: i < currentIndex ? "#10b981" : i === currentIndex ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            {i < currentIndex && <span>✓</span>}
            <span>{c.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}