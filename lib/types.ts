export type Channel = "Chat" | "Call";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Case {
  id: string;
  title: string;
  scenario: string;
  openingMessage: string;
  channel: Channel;
  topic: string;
  difficulty: Difficulty;
  isDefault: boolean;
  createdAt: string;
}

export interface Message {
  role: "agent" | "customer";
  content: string;
  timestamp: string;
}

export interface ScoreBreakdown {
  empathy: number;
  accuracy: number;
  resolution: number;
  professionalism: number;
}

export interface CaseResult {
  caseId: string;
  caseTitle: string;
  topic: string;
  channel: Channel;
  score: number;
  breakdown: ScoreBreakdown;
  feedback: string;
  messages: Message[];
  completedAt: string;
}

export interface Session {
  id: string;
  date: string;
  cases: CaseResult[];
  averageScore: number;
}

export interface DashboardStats {
  currentStreak: number;
  sessionsThisWeek: number;
  topSkill: string;
  skillToImprove: string;
  last10Sessions: Session[];
  dailyScores: { date: string; score: number }[];
  scoreByTopic: { topic: string; score: number }[];
  scoreByChannel: { channel: string; score: number }[];
}
