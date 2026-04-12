import { useRef } from "react";
import { Send } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  turnsLeft: number;
};

export default function ChatInput({ value, onChange, onSend, disabled, turnsLeft }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && value.trim().length > 0 && turnsLeft > 0;

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  }

  return (
    <div
      className="p-3 rounded-b-2xl"
      style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
    >
      <div className="flex gap-2 items-end rounded-xl p-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={turnsLeft === 0 ? "No turns remaining — click End & Score" : "Type your response… (Enter to send)"}
          disabled={turnsLeft === 0 || disabled}
          rows={2}
          className="flex-1 bg-transparent text-sm resize-none outline-none px-2 py-1"
          style={{ color: "var(--text)", maxHeight: 120 }}
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{ background: canSend ? "var(--accent)" : "var(--border)", color: canSend ? "white" : "var(--text-muted)" }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}