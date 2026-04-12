import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

type Props = {
  data: { date: string; score: number }[];
  hasData: boolean;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--accent)" }}>{payload[0].value}</p>
    </div>
  );
};

export default function ScoreChart({ data, hasData }: Props) {
  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
        Score Over Time — Last 30 Days
      </p>
      {!hasData && (
        <p className="text-xs mb-2 text-center" style={{ color: "var(--text-muted)" }}>
          Complete your first session to see your progress here.
        </p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            interval="preserveStartEnd"
            axisLine={false}
            tickLine={false}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone" dataKey="score"
            stroke="#3b82f6" strokeWidth={2.5}
            dot={{ fill: "#3b82f6", r: 3 }}
            activeDot={{ r: 5, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}