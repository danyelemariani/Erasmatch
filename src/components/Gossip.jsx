import React, { useState } from "react";
import { useStore, memberById } from "../context/store.jsx";
import { NeonCard, SectionTitle, Avatar, timeAgo } from "./ui.jsx";
import { REACTION_PALETTE } from "../data/seed.js";

export default function Gossip() {
  const { gossip, postGossip, reactToGossip, members } = useStore();
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    postGossip(text);
    setText("");
  }

  return (
    <section>
      <SectionTitle emoji="🫢" sub="Spill it. React to everyone else's.">
        Gossip Board
      </SectionTitle>

      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Anonymous-ish gossip drop…"
          className="flex-1 rounded-full bg-nightcard2 border border-white/10 px-4 py-2.5 text-white placeholder-white/25 outline-none focus:border-neon-orange text-sm"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-full px-4 font-bold text-night bg-neon-orange disabled:opacity-40 active:scale-95 transition-transform text-sm"
        >
          Drop 🍵
        </button>
      </div>

      <div className="space-y-3">
        {gossip.map((g) => {
          const u = memberById(members, g.userId);
          const entries = Object.entries(g.reactions || {});
          return (
            <NeonCard key={g.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar emoji={u.emoji} ring="ring-neon-orange/40" size="h-8 w-8" />
                <span className="text-sm font-bold text-white">{u.name}</span>
                <span className="text-[10px] text-white/30">· {timeAgo(g.createdAt)}</span>
              </div>
              <p className="text-white/90 text-[15px] leading-snug">{g.text}</p>

              {entries.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {entries.map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => reactToGossip(g.id, emoji)}
                      className="text-xs bg-nightcard2 hover:bg-white/10 rounded-full px-2 py-1 transition-colors active:scale-90"
                    >
                      {emoji} <span className="text-white/60 font-semibold">{count}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/5">
                {REACTION_PALETTE.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => reactToGossip(g.id, emoji)}
                    className="text-base opacity-50 hover:opacity-100 hover:scale-110 transition-all px-1"
                    aria-label={`React ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </NeonCard>
          );
        })}
      </div>
    </section>
  );
}
