import React from "react";
import { useStore } from "../context/store.jsx";
import { SectionTitle } from "./ui.jsx";

export default function Badges() {
  const { badges } = useStore();
  const unlocked = badges.filter((b) => b.unlocked).length;

  return (
    <section>
      <SectionTitle emoji="🏆" sub={`${unlocked} of ${badges.length} unlocked. Keep going, legend.`}>
        Achievements
      </SectionTitle>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`relative rounded-2xl p-3 text-center transition-all ${
              b.unlocked
                ? "bg-gradient-to-br from-nightcard2 to-nightcard ring-1 ring-neon-purple/40 animate-pulseglow"
                : "bg-nightcard/60 ring-1 ring-white/5"
            }`}
            title={b.desc}
          >
            <div
              className={`text-3xl mb-1 ${b.unlocked ? "" : "grayscale opacity-30"}`}
            >
              {b.emoji}
            </div>
            <div
              className={`text-[11px] font-bold leading-tight ${
                b.unlocked ? "text-white" : "text-white/30"
              }`}
            >
              {b.name}
            </div>
            <div className="text-[9px] text-white/40 mt-1 leading-tight">
              {b.unlocked ? b.desc : "🔒 Locked"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
