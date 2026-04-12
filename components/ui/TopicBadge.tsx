const COLORS: Record<string, { bg: string; color: string }> = {
  Billing: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
  Technical: { bg: "rgba(139,92,246,0.1)", color: "#a78bfa" },
  Retention: { bg: "rgba(236,72,153,0.1)", color: "#f472b6" },
  "De-escalation": { bg: "rgba(239,68,68,0.1)", color: "#f87171" },
  "Account Access": { bg: "rgba(16,185,129,0.1)", color: "#34d399" },
  "General Enquiry": { bg: "rgba(245,158,11,0.1)", color: "#fbbf24" },
};

const DEFAULT = { bg: "rgba(100,116,139,0.1)", color: "#94a3b8" };

export default function TopicBadge({ topic }: { topic: string }) {
  const s = COLORS[topic] || DEFAULT;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {topic}
    </span>
  );
}
