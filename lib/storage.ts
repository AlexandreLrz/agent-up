import { Case, Session, DashboardStats } from "./types";
import { DEFAULT_CASES } from "./cases";

const CASES_KEY = "agentup_cases";
const SESSIONS_KEY = "agentup_sessions";

// ── Cases ────────────────────────────────────────────────────────────────────

export function getCases(): Case[] {
  if (typeof window === "undefined") return DEFAULT_CASES;
  try {
    const stored = localStorage.getItem(CASES_KEY);
    const custom: Case[] = stored ? JSON.parse(stored) : [];
    return [...DEFAULT_CASES, ...custom];
  } catch {
    return DEFAULT_CASES;
  }
}

export function saveCase(c: Case): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(CASES_KEY);
    const custom: Case[] = stored ? JSON.parse(stored) : [];
    custom.push(c);
    localStorage.setItem(CASES_KEY, JSON.stringify(custom));
  } catch { }
}

export function deleteCase(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(CASES_KEY);
    const custom: Case[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem(
      CASES_KEY,
      JSON.stringify(custom.filter((c) => c.id !== id))
    );
  } catch { }
}

// ── Sessions ─────────────────────────────────────────────────────────────────

export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    const sessions = getSessions();
    sessions.unshift(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    window.dispatchEvent(new Event("sessions-updated")); // ← ajoute ça
  } catch { }
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export function computeStats(): DashboardStats {
  const sessions = getSessions();

  // streak
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const found = sessions.find((s) => s.date === dateStr);
    if (found) streak++;
    else if (i === 0) continue;
    else break;
  }

  // sessions this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const sessionsThisWeek = sessions.filter(
    (s) => new Date(s.date) >= weekAgo
  ).length;

  // daily scores last 30 days
  const dailyScores: { date: string; score: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const daySession = sessions.find((s) => s.date === dateStr);
    if (daySession) {
      dailyScores.push({ date: dateStr, score: Math.round(daySession.averageScore) });
    }
  }

  // score by topic
  const topicMap: Record<string, number[]> = {};
  sessions.forEach((s) =>
    s.cases.forEach((c) => {
      if (!topicMap[c.topic]) topicMap[c.topic] = [];
      topicMap[c.topic].push(c.score);
    })
  );
  const scoreByTopic = Object.entries(topicMap).map(([topic, scores]) => ({
    topic,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  // score by channel
  const channelMap: Record<string, number[]> = {};
  sessions.forEach((s) =>
    s.cases.forEach((c) => {
      const ch = c.channel;
      if (!channelMap[ch]) channelMap[ch] = [];
      channelMap[ch].push(c.score);
    })
  );
  const scoreByChannel = Object.entries(channelMap).map(([channel, scores]) => ({
    channel,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  // top skill / skill to improve from breakdown
  const dims = ["empathy", "accuracy", "resolution", "professionalism"];
  const dimLabels: Record<string, string> = {
    empathy: "Empathy & Tone",
    accuracy: "Accuracy",
    resolution: "Resolution",
    professionalism: "Professionalism",
  };
  const dimTotals: Record<string, number[]> = {};
  dims.forEach((d) => (dimTotals[d] = []));
  sessions.forEach((s) =>
    s.cases.forEach((c) => {
      dims.forEach((d) =>
        dimTotals[d].push(c.breakdown[d as keyof typeof c.breakdown])
      );
    })
  );
  const dimAvgs = dims.map((d) => ({
    dim: d,
    avg: dimTotals[d].length
      ? dimTotals[d].reduce((a, b) => a + b, 0) / dimTotals[d].length
      : 0,
  }));
  dimAvgs.sort((a, b) => b.avg - a.avg);
  const topSkill = dimAvgs[0]?.avg > 0 ? dimLabels[dimAvgs[0].dim] : "—";
  const skillToImprove =
    dimAvgs[dimAvgs.length - 1]?.avg !== undefined && sessions.length > 0
      ? dimLabels[dimAvgs[dimAvgs.length - 1].dim]
      : "—";

  return {
    currentStreak: streak,
    sessionsThisWeek,
    topSkill,
    skillToImprove,
    last10Sessions: sessions.slice(0, 10),
    dailyScores,
    scoreByTopic,
    scoreByChannel,
  };
}

// ── Daily session case picker ─────────────────────────────────────────────────

export function pickDailySession(cases: Case[], count = 3): Case[] {
  // Seed by today's date for consistency within a day
  const today = new Date().toISOString().split("T")[0];
  const seed = today.split("-").reduce((acc, n) => acc + parseInt(n), 0);
  const shuffled = [...cases].sort((a, b) => {
    const ha = simpleHash(a.id + seed);
    const hb = simpleHash(b.id + seed);
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

function simpleHash(str: string | number): number {
  const s = String(str);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
