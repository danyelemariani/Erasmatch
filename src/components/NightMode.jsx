import React, { useState } from "react";
import { StoreProvider, useStore } from "../context/store.jsx";
import ChaosLog from "./ChaosLog.jsx";
import Badges from "./Badges.jsx";
import Challenges from "./Challenges.jsx";
import Leaderboard from "./Leaderboard.jsx";
import GroupChat from "./GroupChat.jsx";
import Gossip from "./Gossip.jsx";

const TABS = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "play", label: "Play", emoji: "🎯" },
  { id: "rank", label: "Rank", emoji: "📊" },
  { id: "chat", label: "Chat", emoji: "💬" },
  { id: "tea", label: "Tea", emoji: "🫢" },
];

function Header({ onDisguise }) {
  const { myPoints } = useStore();
  return (
    <header className="sticky top-0 z-20 bg-night/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white leading-none">
            Erasm<span className="text-neon-pink">ess</span>
          </h1>
          <p className="text-[10px] text-neon-cyan font-semibold tracking-wide">
            NIGHT MODE · {myPoints} chaos pts
          </p>
        </div>
        <button
          onClick={onDisguise}
          className="text-xs font-semibold text-white/60 bg-nightcard2 hover:bg-nightcard px-3 py-2 rounded-full ring-1 ring-white/10 transition-colors"
          title="Quick, look innocent"
        >
          🫥 Hide
        </button>
      </div>
    </header>
  );
}

function NightContent({ onDisguise }) {
  const [tab, setTab] = useState("home");

  return (
    <div className="min-h-full bg-night font-display flex flex-col animate-glitchin">
      <Header onDisguise={onDisguise} />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 pb-28 space-y-8">
        {tab === "home" && (
          <>
            <ChaosLog />
            <Badges />
          </>
        )}
        {tab === "play" && <Challenges />}
        {tab === "rank" && <Leaderboard />}
        {tab === "chat" && <GroupChat />}
        {tab === "tea" && <Gossip />}
      </main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-20 bg-nightcard/90 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-md mx-auto px-2 py-2 grid grid-cols-5 gap-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all ${
                  active ? "bg-neon-purple/20" : ""
                }`}
              >
                <span className={`text-xl ${active ? "scale-110" : "opacity-60"} transition-transform`}>
                  {t.emoji}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    active ? "text-neon-purple" : "text-white/40"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function NightMode({ onDisguise }) {
  return (
    <StoreProvider>
      <NightContent onDisguise={onDisguise} />
    </StoreProvider>
  );
}
