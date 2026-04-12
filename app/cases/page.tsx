"use client";

import { useState, useEffect } from "react";
import { Case } from "@/lib/types";
import { getCases, saveCase, deleteCase } from "@/lib/storage";
import { DEFAULT_TOPICS } from "@/lib/cases";
import { Plus } from "lucide-react";
import CaseFilters, { FilterState } from "./CaseFilters";
import CaseCard from "./CaseCard";
import CreateCaseModal from "./CreateCaseModal";

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [allTopics, setAllTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [filters, setFilters] = useState<FilterState>({ topic: "", channel: "", difficulty: "", search: "" });
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const all = getCases();
    setCases(all);
    setAllTopics(Array.from(new Set([...DEFAULT_TOPICS, ...all.map((c) => c.topic)])));
  }, []);

  function handleSave(newCase: Case) {
    saveCase(newCase);
    const updated = getCases();
    setCases(updated);
    setAllTopics(Array.from(new Set([...DEFAULT_TOPICS, ...updated.map((c) => c.topic)])));
    setShowForm(false);
  }

  function handleDelete(id: string) {
    deleteCase(id);
    setCases(getCases());
  }

  const filtered = cases.filter((c) => {
    if (filters.topic && c.topic !== filters.topic) return false;
    if (filters.channel && c.channel !== filters.channel) return false;
    if (filters.difficulty && c.difficulty !== filters.difficulty) return false;
    if (filters.search && !c.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ fontWeight: 800 }}>My Cases</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {cases.length} available · {cases.filter((c) => !c.isDefault).length} custom
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--accent)", color: "white" }}
        >
          <Plus size={16} />
          New Case
        </button>
      </div>

      <CaseFilters filters={filters} onChange={setFilters} topics={allTopics} />

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <p>No cases match your filters.</p>
          </div>
        )}
        {filtered.map((c, i) => (
          <CaseCard
            key={c.id}
            case_={c}
            index={i}
            expanded={expandedId === c.id}
            onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <CreateCaseModal
          topics={allTopics}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}