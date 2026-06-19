import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  CURRENT_USER,
  GROUP_MEMBERS,
  BADGES,
  SEED_CHALLENGES,
  SEED_CHAOS_LOG,
  SEED_CHAT,
  SEED_GOSSIP,
} from "../data/seed.js";

const StoreContext = createContext(null);

const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

// Keywords that drive badge unlocking from free-text stories
const KEBAB_WORDS = ["kebab", "döner", "doner", "kebap"];
const REJECTION_WORDS = ["rejected", "rejection", "ghosted", "no luck", "struck out", "ignored"];
const BLACKOUT_WORDS = ["don't remember", "dont remember", "blackout", "blank", "no memory", "barely remember"];

function computeStats(log) {
  const mine = log.filter((e) => e.userId === CURRENT_USER.id);
  const text = mine.map((e) => e.story.toLowerCase()).join(" | ");
  const toHour = (t) => parseInt((t || "0").split(":")[0], 10) || 0;
  return {
    entryCount: mine.length,
    maxLanguages: mine.reduce((m, e) => Math.max(m, e.languages || 0), 0),
    totalLanguages: mine.reduce((sum, e) => sum + (e.languages || 0), 0),
    maxChaos: mine.reduce((m, e) => Math.max(m, e.chaos || 0), 0),
    hasEarlyNight: mine.some((e) => { const h = toHour(e.homeTime); return h >= 0 && h < 1; }),
    hasSunrise: mine.some((e) => { const h = toHour(e.homeTime); return h >= 6 && h <= 11; }),
    kebabCount: mine.filter((e) => KEBAB_WORDS.some((w) => e.story.toLowerCase().includes(w))).length,
    hasRejection: REJECTION_WORDS.some((w) => text.includes(w)),
    hasBlackout: BLACKOUT_WORDS.some((w) => text.includes(w)),
  };
}

// (early-night now computed inline in computeStats: home time 00:00–00:59)

export function StoreProvider({ children }) {
  const [chaosLog, setChaosLog] = useState(SEED_CHAOS_LOG);
  const [challenges, setChallenges] = useState(SEED_CHALLENGES);
  const [chat, setChat] = useState(SEED_CHAT);
  const [gossip, setGossip] = useState(SEED_GOSSIP);

  // ---- Chaos Log ----
  const addChaosEntry = useCallback((entry) => {
    setChaosLog((prev) => [
      { id: uid("log"), userId: CURRENT_USER.id, createdAt: Date.now(), ...entry },
      ...prev,
    ]);
  }, []);

  // ---- Challenges ----
  const toggleChallenge = useCallback((id) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }, []);

  // ---- Chat ----
  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    setChat((prev) => [...prev, { id: uid("m"), userId: CURRENT_USER.id, text: text.trim(), createdAt: Date.now() }]);
  }, []);

  // ---- Gossip ----
  const postGossip = useCallback((text) => {
    if (!text.trim()) return;
    setGossip((prev) => [
      { id: uid("g"), userId: CURRENT_USER.id, text: text.trim(), reactions: {}, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const reactToGossip = useCallback((id, emoji) => {
    setGossip((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, reactions: { ...g.reactions, [emoji]: (g.reactions[emoji] || 0) + 1 } } : g
      )
    );
  }, []);

  // ---- Derived ----
  const stats = useMemo(() => computeStats(chaosLog), [chaosLog]);

  const badges = useMemo(
    () => BADGES.map((b) => ({ ...b, unlocked: b.check(stats) })),
    [stats]
  );

  // My chaos points = sum of my chaos ratings + completed challenge points
  const myPoints = useMemo(() => {
    const fromLog = chaosLog
      .filter((e) => e.userId === CURRENT_USER.id)
      .reduce((sum, e) => sum + (e.chaos || 0), 0);
    const fromChallenges = challenges.filter((c) => c.done).reduce((sum, c) => sum + c.points, 0);
    return fromLog + fromChallenges;
  }, [chaosLog, challenges]);

  // Leaderboard combines mocked friends + live "you"
  const leaderboard = useMemo(() => {
    const others = GROUP_MEMBERS.filter((m) => m.id !== CURRENT_USER.id).map((m) => ({
      ...m,
      points: m.points || 0,
    }));
    const me = { ...CURRENT_USER, points: myPoints };
    return [...others, me].sort((a, b) => b.points - a.points);
  }, [myPoints]);

  const value = {
    currentUser: CURRENT_USER,
    members: GROUP_MEMBERS,
    chaosLog,
    addChaosEntry,
    challenges,
    toggleChallenge,
    chat,
    sendMessage,
    gossip,
    postGossip,
    reactToGossip,
    stats,
    badges,
    myPoints,
    leaderboard,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function memberById(members, id) {
  return members.find((m) => m.id === id) || { name: "Someone", emoji: "👤" };
}
