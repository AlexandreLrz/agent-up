import { CallStatus } from "@/hooks/useDeepgramCall";

const STATUS_MAP: Record<CallStatus, { label: string; color: string; bg: string }> = {
  idle:       { label: "Ready",        color: "#94a3b8", bg: "rgba(100,116,139,0.1)" },
  connecting: { label: "Connecting…",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  live:       { label: "Live",         color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  ended:      { label: "Ended",        color: "#64748b", bg: "rgba(100,116,139,0.1)" },
};

export default function StatusPill({ status }: { status: CallStatus }) {
  const s = STATUS_MAP[status];
  return (
    <span
      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {status === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
      )}
      {s.label}
    </span>
  );
}