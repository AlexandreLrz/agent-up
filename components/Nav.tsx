"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, BookOpen, BarChart2 } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Daily Training", icon: Zap },
  { href: "/cases", label: "My Cases", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
];

export default function Nav() {
  const path = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(10,15,30,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <span
            className="font-display font-800 text-lg tracking-tight"
            style={{ fontWeight: 800 }}
          >
            Agent<span style={{ color: "var(--accent)" }}>Up</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                style={
                  active
                    ? { background: "rgba(59,130,246,0.15)", color: "var(--accent)" }
                    : {}
                }
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Agent badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span style={{ color: "var(--text-muted)" }}>Alex Chen</span>
        </div>
      </div>
    </header>
  );
}
