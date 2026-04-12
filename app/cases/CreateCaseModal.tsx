"use client";

import { useState } from "react";
import { Case, Channel, Difficulty } from "@/lib/types";
import { X } from "lucide-react";

type FormState = {
  title: string;
  scenario: string;
  openingMessage: string;
  channel: Channel;
  topic: string;
  customTopic: string;
  difficulty: Difficulty;
};

const EMPTY_FORM: FormState = {
  title: "", scenario: "", openingMessage: "",
  channel: "Chat", topic: "", customTopic: "", difficulty: "Beginner",
};

type Props = {
  topics: string[];
  onSave: (c: Case) => void;
  onClose: () => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreateCaseModal({ topics, onSave, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");

  function set(patch: Partial<FormState>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function handleSave() {
    const finalTopic = form.topic === "__new__" ? form.customTopic.trim() : form.topic;
    if (!form.title.trim() || !form.scenario.trim() || !form.openingMessage.trim() || !finalTopic) {
      setError("Please fill in all fields.");
      return;
    }
    onSave({
      id: `custom-${Date.now()}`,
      title: form.title.trim(),
      scenario: form.scenario.trim(),
      openingMessage: form.openingMessage.trim(),
      channel: form.channel,
      topic: finalTopic,
      difficulty: form.difficulty,
      isDefault: false,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: "var(--card)", border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-bold text-lg" style={{ fontWeight: 700 }}>Create New Case</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="e.g. Angry customer — delivery delay"
              className="input-field"
            />
          </Field>

          <Field label="Customer Scenario">
            <textarea
              value={form.scenario}
              onChange={(e) => set({ scenario: e.target.value })}
              placeholder="Describe the situation the customer is in…"
              rows={3}
              className="input-field resize-none"
            />
          </Field>

          <Field label="Customer Opening Message">
            <textarea
              value={form.openingMessage}
              onChange={(e) => set({ openingMessage: e.target.value })}
              placeholder="The first thing the customer says…"
              rows={2}
              className="input-field resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Channel">
              <select value={form.channel} onChange={(e) => set({ channel: e.target.value as Channel })} className="input-field">
                <option>Chat</option>
                <option>Call</option>
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={form.difficulty} onChange={(e) => set({ difficulty: e.target.value as Difficulty })} className="input-field">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </Field>
          </div>

          <Field label="Topic">
            <select value={form.topic} onChange={(e) => set({ topic: e.target.value })} className="input-field">
              <option value="">Select a topic…</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="__new__">+ Create new topic</option>
            </select>
          </Field>

          {form.topic === "__new__" && (
            <Field label="New Topic Name">
              <input
                value={form.customTopic}
                onChange={(e) => set({ customTopic: e.target.value })}
                placeholder="e.g. Returns & Refunds"
                className="input-field"
              />
            </Field>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Save Case
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .input-field:focus { border-color: var(--accent); }
        .input-field::placeholder { color: var(--text-muted); }
        .input-field option { background: var(--surface); }
      `}</style>
    </div>
  );
}