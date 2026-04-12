"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "@/lib/types";
import { computeStats } from "@/lib/storage";
import { Flame, Calendar, Star, TrendingUp } from "lucide-react";
import TopicChannelCharts from "./TopicChannelCharts";
import ScoreChart from "./ScoreChart";
import RecentSessions from "./RecentSessions";
import StatCard from "./StatCard";

const emptyDailyScores = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return { date: d.toISOString().split("T")[0], score: 0 };
});

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const refresh = () => setStats(computeStats());
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("sessions-updated", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("sessions-updated", refresh);
    };
  }, []);

  const hasData = (stats?.last10Sessions.length ?? 0) > 0;
  const dailyData = stats?.dailyScores.length ? stats.dailyScores : emptyDailyScores;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ fontWeight: 800 }}>My Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Your performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<Flame size={16} style={{ color: "#f97316" }} />} label="Streak" value={stats?.currentStreak ?? 0} sub="days in a row" />
        <StatCard icon={<Calendar size={16} style={{ color: "var(--accent)" }} />} label="This Week" value={stats?.sessionsThisWeek ?? 0} sub="sessions completed" />
        <StatCard icon={<Star size={16} style={{ color: "#f59e0b" }} />} label="Top Skill" value={stats?.topSkill ?? "—"} />
        <StatCard icon={<TrendingUp size={16} style={{ color: "#a78bfa" }} />} label="Improve" value={stats?.skillToImprove ?? "—"} />
      </div>

      <ScoreChart data={dailyData} hasData={hasData} />

      <TopicChannelCharts
        hasData={hasData}
        scoreByTopic={stats?.scoreByTopic ?? []}
        scoreByChannel={stats?.scoreByChannel ?? []}
      />

      <RecentSessions sessions={stats?.last10Sessions ?? []} hasData={hasData} />
    </div>
  );
}