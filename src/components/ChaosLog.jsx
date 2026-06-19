import React, { useState } from "react";
import { useStore } from "../context/store.jsx";
import { NeonCard, SectionTitle, timeAgo } from "./ui.jsx";

function ChaosMeter({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-white/80">Chaos Meter</span>
        <span className="text-lg font-black text-neon-pink">{value}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-neon-pink"
        style={{ accentColor: "#ff2d95" }}
      />
      <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
        <span>tame 😇</span>
        <span>unhinged 🌪️</span>
      </div>
    </div>
  );
}

export default function ChaosLog() {
  const { chaosLog, addChaosEntry, currentUser } = useStore();
  const [open, setOpen] = useState(false);
  const [homeTime, setHomeTime] = useState("03:00");
  const [languages, setLanguages] = useState(2);
  const [story, setStory] = useState("");
  const [chaos, setChaos] = useState(6);

  const mine = chaosLog.filter((e) => e.userId === currentUser.id);

  function submit() {
    if (!story.trim()) return;
    addChaosEntry({ homeTime, languages: Number(languages), story: story.trim(), chaos });
    setStory("");
    setLanguages(2);
    setChaos(6);
    setHomeTime("03:00");
    setOpen(false);
  }

  return (
    <section>
      <SectionTitle emoji="📋" sub="Submit a damage report after the night.">
        Chaos Log
      </SectionTitle>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl py-3 font-bold text-night bg-gradient-to-r from-neon-pink to-neon-purple shadow-neon active:scale-[0.98] transition-transform"
        >
          + New Damage Report
        </button>
      ) : (
        <NeonCard className="p-4 animate-pop">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-white/60">Got home at</span>
                <input
                  type="time"
                  value={homeTime}
                  onChange={(e) => setHomeTime(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-nightcard2 border border-white/10 px-3 py-2 text-white outline-none focus:border-neon-cyan"
                />
              </label>
              <label className="block">
                <span className="text-xs text-white/60">Languages attempted</span>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-nightcard2 border border-white/10 px-3 py-2 text-white outline-none focus:border-neon-cyan"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs text-white/60">What happened?</span>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={3}
                placeholder="Be honest. The kebab guy remembers everything…"
                className="mt-1 w-full rounded-xl bg-nightcard2 border border-white/10 px-3 py-2 text-white placeholder-white/25 outline-none focus:border-neon-cyan resize-none"
              />
            </label>

            <ChaosMeter value={chaos} onChange={setChaos} />

            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={!story.trim()}
                className="flex-1 rounded-xl py-2.5 font-bold text-night bg-neon-lime disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
              >
                Log it 🔥
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl py-2.5 px-4 font-semibold text-white/70 bg-nightcard2"
              >
                Cancel
              </button>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Timeline */}
      <div className="mt-4 space-y-3">
        {mine.length === 0 && (
          <p className="text-center text-white/30 text-sm py-6">
            No chaos logged yet. Suspicious. 🤨
          </p>
        )}
        {mine.map((e) => (
          <NeonCard key={e.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span className="text-neon-cyan font-bold">🏠 {e.homeTime}</span>
                <span>·</span>
                <span>🗣️ {e.languages} lang</span>
              </div>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  e.chaos >= 8
                    ? "bg-neon-pink/20 text-neon-pink"
                    : e.chaos >= 5
                    ? "bg-neon-yellow/20 text-neon-yellow"
                    : "bg-neon-cyan/20 text-neon-cyan"
                }`}
              >
                {e.chaos}/10
              </span>
            </div>
            <p className="mt-2 text-white/90 text-[15px] leading-snug">{e.story}</p>
            <p className="mt-2 text-[11px] text-white/30">{timeAgo(e.createdAt)}</p>
          </NeonCard>
        ))}
      </div>
    </section>
  );
}
