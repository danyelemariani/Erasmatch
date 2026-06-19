import React from "react";
import { useStore } from "../context/store.jsx";
import { NeonCard, SectionTitle, Avatar } from "./ui.jsx";

const MEDALS = ["👑", "🥈", "🥉"];

export default function Leaderboard() {
  const { leaderboard, currentUser } = useStore();
  const max = Math.max(1, ...leaderboard.map((m) => m.points));

  return (
    <section>
      <SectionTitle emoji="📊" sub="Biggest legend of the week wears the crown.">
        Weekly Leaderboard
      </SectionTitle>

      <NeonCard className="p-3 space-y-2">
        {leaderboard.map((m, i) => {
          const isMe = m.id === currentUser.id;
          return (
            <div
              key={m.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${
                isMe ? "bg-neon-purple/15 ring-1 ring-neon-purple/40" : "bg-nightcard2/50"
              }`}
            >
              <div className="w-7 text-center text-lg shrink-0">
                {i < 3 ? MEDALS[i] : <span className="text-white/40 font-bold text-sm">{i + 1}</span>}
              </div>
              <Avatar emoji={m.emoji} ring={isMe ? "ring-neon-purple/60" : "ring-white/10"} size="h-9 w-9" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm flex items-center gap-1">
                  {m.name} {isMe && <span className="text-[10px] text-neon-purple">(you)</span>}
                </div>
                <div className="h-1.5 mt-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-purple transition-all"
                    style={{ width: `${(m.points / max) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-neon-cyan leading-none">{m.points}</div>
                <div className="text-[9px] text-white/30">pts</div>
              </div>
            </div>
          );
        })}
      </NeonCard>
    </section>
  );
}
