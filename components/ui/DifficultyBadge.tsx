import { Difficulty } from "@/lib/types";

const styles: Record<Difficulty, { bg: string; color: string; border: string }> = {
  Beginner: {
    bg: "rgba(16,185,129,0.1)",
    color: "#10b981",
    border: "rgba(16,185,129,0.3)",
  },
  Intermediate: {
    bg: "rgba(245,158,11,0.1)",
    color: "#f59e0b",
    border: "rgba(245,158,11,0.3)",
  },
  Advanced: {
    bg: "rgba(239,68,68,0.1)",
    color: "#ef4444",
    border: "rgba(239,68,68,0.3)",
  },
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const s = styles[difficulty];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {difficulty}
    </span>
  );
}
