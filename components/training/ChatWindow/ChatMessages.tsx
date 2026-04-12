import { useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { User, Headphones } from "lucide-react";
import clsx from "clsx";

type Props = {
  messages: Message[];
  sending: boolean;
};

export default function ChatMessages({ messages, sending }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
    >
      {messages.map((msg, i) => (
        <div key={i} className={clsx("flex gap-2.5 animate-fade-in", msg.role === "agent" ? "flex-row-reverse" : "flex-row")}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: msg.role === "agent" ? "rgba(59,130,246,0.2)" : "rgba(239,68,68,0.15)" }}
          >
            {msg.role === "agent"
              ? <User size={12} style={{ color: "var(--accent)" }} />
              : <Headphones size={12} style={{ color: "#f87171" }} />}
          </div>
          <div className={clsx("max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed", msg.role === "agent" ? "rounded-tr-sm bubble-agent text-white" : "rounded-tl-sm bubble-customer")}>
            {msg.content}
          </div>
        </div>
      ))}

      {sending && (
        <div className="flex gap-2.5 animate-fade-in">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>
            <Headphones size={12} style={{ color: "#f87171" }} />
          </div>
          <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bubble-customer flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-muted)", animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}