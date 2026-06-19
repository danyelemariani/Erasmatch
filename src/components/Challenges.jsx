import React from "react";
import { useStore } from "../context/store.jsx";
import { NeonCard, SectionTitle } from "./ui.jsx";

export default function Challenges() {
  const { challenges, toggleChallenge } = useStore();
  const doneCount = challenges.filter((c) => c.done).length;

  return (
    <section>
      <SectionTitle emoji="🎯" sub={`${doneCount} done this week. Each one feeds the leaderboard.`}>
        Weekly Challenges
      </SectionTitle>

      <div className="space-y-3">
        {challenges.map((c) => (
          <NeonCard
            key={c.id}
            className={`p-4 flex items-center gap-3 transition-all ${
              c.done ? "ring-1 ring-neon-lime/50" : ""
            }`}
          >
            <div className="text-3xl shrink-0">{c.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white flex items-center gap-2">
                {c.title}
                <span className="text-[10px] font-black text-neon-yellow bg-neon-yellow/15 px-1.5 py-0.5 rounded-full">
                  +{c.points}
                </span>
              </div>
              <div className="text-[13px] text-white/50 leading-snug">{c.desc}</div>
            </div>
            <button
              onClick={() => toggleChallenge(c.id)}
              aria-pressed={c.done}
              className={`shrink-0 h-9 w-9 rounded-full grid place-items-center font-black transition-all active:scale-90 ${
                c.done
                  ? "bg-neon-lime text-night shadow-[0_0_14px_rgba(170,255,0,0.6)]"
                  : "bg-nightcard2 text-white/40 ring-1 ring-white/10"
              }`}
            >
              {c.done ? "✓" : "+"}
            </button>
          </NeonCard>
        ))}
      </div>
    </section>
  );
}
