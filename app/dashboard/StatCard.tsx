type Props = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
};

export default function StatCard({ icon, label, value, sub }: Props) {
  return (
    <div
      className="rounded-xl p-4 animate-slide-up"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.1)" }}
        >
          {icon}
        </div>
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="font-display text-2xl font-bold" style={{ fontWeight: 700 }}>{value}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}