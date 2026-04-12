"use client";

import { Search, X } from "lucide-react";

export type FilterState = {
  topic: string;
  channel: string;
  difficulty: string;
  search: string;
};

type Props = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  topics: string[];
};

export default function CaseFilters({ filters, onChange, topics }: Props) {
  const hasFilters = filters.topic || filters.channel || filters.difficulty || filters.search;

  return (
    <div
      className="rounded-xl p-3 mb-5 flex flex-wrap gap-2"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-lg"
        style={{ background: "var(--surface)" }}
      >
        <Search size={14} style={{ color: "var(--text-muted)" }} />
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search cases…"
          className="bg-transparent text-sm outline-none flex-1"
          style={{ color: "var(--text)" }}
        />
      </div>

      <select
        value={filters.topic}
        onChange={(e) => onChange({ ...filters, topic: e.target.value })}
        className="px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "var(--surface)", color: "var(--text)", border: "none" }}
      >
        <option value="">All Topics</option>
        {topics.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        value={filters.channel}
        onChange={(e) => onChange({ ...filters, channel: e.target.value })}
        className="px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "var(--surface)", color: "var(--text)", border: "none" }}
      >
        <option value="">All Channels</option>
        <option>Chat</option>
        <option>Call</option>
      </select>

      <select
        value={filters.difficulty}
        onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
        className="px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "var(--surface)", color: "var(--text)", border: "none" }}
      >
        <option value="">All Difficulties</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      {hasFilters && (
        <button
          onClick={() => onChange({ topic: "", channel: "", difficulty: "", search: "" })}
          className="px-3 py-2 rounded-lg text-xs transition-all hover:opacity-80"
          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
        >
          Clear
        </button>
      )}
    </div>
  );
}