import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MessageSquare, Phone } from "lucide-react";

type TopicScore = { topic: string; score: number };
type ChannelScore = { channel: string; score: number };

type Props = {
  hasData: boolean;
  scoreByTopic: TopicScore[];
  scoreByChannel: ChannelScore[];
};

function scoreColor(s: number) {
  if (s >= 75) return "#10b981";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--accent)" }}>{payload[0].value}</p>
    </div>
  );
};

const NoData = () => (
  <div className="flex items-center justify-center h-32" style={{ color: "var(--text-muted)" }}>
    <p className="text-xs">No data yet</p>
  </div>
);

export default function TopicChannelCharts({ hasData, scoreByTopic, scoreByChannel }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      {/* Score by topic */}
      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Score by Topic
        </p>
        {!hasData ? <NoData /> : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={scoreByTopic} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="topic" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {scoreByTopic.map((entry, i) => (
                  <Cell key={i} fill={scoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Score by channel */}
      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Score by Channel
        </p>
        {!hasData ? <NoData /> : (
          <div className="space-y-4 pt-2">
            {scoreByChannel.map((c) => (
              <div key={c.channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    {c.channel === "Chat"
                      ? <MessageSquare size={14} style={{ color: "var(--accent)" }} />
                      : <Phone size={14} style={{ color: "#a78bfa" }} />}
                    <span>{c.channel}</span>
                  </div>
                  <span className="font-mono font-medium text-sm" style={{ color: scoreColor(c.score) }}>{c.score}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.score}%`, background: c.channel === "Chat" ? "var(--accent)" : "#a78bfa" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}