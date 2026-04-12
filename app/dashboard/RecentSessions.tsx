import { Session } from "@/lib/types";

type Props = {
  sessions: Session[];
  hasData: boolean;
};

function scoreColor(s: number) {
  if (s >= 75) return "#10b981";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function RecentSessions({ sessions, hasData }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Recent Sessions
        </p>
      </div>
      {!hasData ? (
        <div className="px-5 py-10 text-center" style={{ color: "var(--text-muted)" }}>
          <p className="text-sm">No sessions yet. Complete your first Daily Training to see results here.</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {sessions.map((session) => (
            <div key={session.id} className="px-5 py-3 flex items-center gap-4">
              <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                {new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
              <div className="flex-1 flex gap-1.5 flex-wrap">
                {session.cases.map((c, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface)", color: "#94a3b8" }}>
                    {c.caseTitle}
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold font-mono flex-shrink-0" style={{ color: scoreColor(session.averageScore) }}>
                {session.averageScore}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}