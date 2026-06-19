import React from "react";

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NeonCard({ className = "", children, ...rest }) {
  return (
    <div
      className={`rounded-3xl bg-nightcard border border-white/5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ emoji, children, sub }) {
  return (
    <div className="mb-3">
      <h2 className="text-2xl font-black text-white flex items-center gap-2">
        <span>{emoji}</span>
        <span>{children}</span>
      </h2>
      {sub && <p className="text-white/40 text-sm mt-0.5">{sub}</p>}
    </div>
  );
}

export function Avatar({ emoji, ring = "ring-neon-purple/40", size = "h-10 w-10" }) {
  return (
    <div
      className={`${size} shrink-0 rounded-full grid place-items-center bg-nightcard2 ring-2 ${ring} text-lg`}
    >
      {emoji}
    </div>
  );
}
