// All mock/in-memory data lives here. Swap these for API calls later.

export const CURRENT_USER = { id: "u_me", name: "You", emoji: "🫠" };

export const GROUP_MEMBERS = [
  CURRENT_USER,
  { id: "u_lucia", name: "Lucía", emoji: "💃", points: 47 },
  { id: "u_jonas", name: "Jonas", emoji: "🍺", points: 38 },
  { id: "u_amara", name: "Amara", emoji: "🦩", points: 31 },
  { id: "u_theo", name: "Théo", emoji: "🥐", points: 26 },
  { id: "u_kasia", name: "Kasia", emoji: "🪩", points: 19 },
];

// Badge definitions. `check(stats)` returns true when unlocked.
export const BADGES = [
  { id: "lost_in_translation", emoji: "🗣️", name: "Lost in Translation", desc: "Attempted 3+ languages in one night.", check: (s) => s.maxLanguages >= 3 },
  { id: "speedrun", emoji: "🏃", name: "Speedrun", desc: "Home before 1am. Rookie hours, respect.", check: (s) => s.hasEarlyNight },
  { id: "anonymous_match", emoji: "🎭", name: "Anonymous Match", desc: "A night you logged but barely remember.", check: (s) => s.hasBlackout },
  { id: "walk_of_fame", emoji: "🚶", name: "Walk of Fame", desc: "Got home after sunrise (6am+).", check: (s) => s.hasSunrise },
  { id: "kebab_illegal", emoji: "🥙", name: "Kebab at Illegal Hours", desc: "The sacred 4am kebab was consumed.", check: (s) => s.kebabCount >= 1 },
  { id: "drunken_polyglot", emoji: "🌍", name: "Drunken Polyglot", desc: "5+ languages across your whole log.", check: (s) => s.totalLanguages >= 5 },
  { id: "tour_of_rejection", emoji: "💔", name: "Tour of Rejection", desc: "Survived the night anyway. Hero.", check: (s) => s.hasRejection },
  { id: "max_chaos", emoji: "🌪️", name: "Certified Disaster", desc: "Logged a perfect 10/10 chaos night.", check: (s) => s.maxChaos >= 10 },
  { id: "consistent", emoji: "🔁", name: "No Days Off", desc: "Logged 5+ separate nights.", check: (s) => s.entryCount >= 5 },
];

export const SEED_CHALLENGES = [
  { id: "c1", emoji: "🥂", title: "Polyglot Toast", desc: "Learn a toast in 3 different languages.", points: 5, done: false },
  { id: "c2", emoji: "🌅", title: "Sunrise Survivor", desc: "Survive a Spanish house party till sunrise.", points: 8, done: false },
  { id: "c3", emoji: "🍝", title: "Cultural Exchange", desc: "Cook your country's dish for the flat.", points: 4, done: false },
  { id: "c4", emoji: "🚲", title: "No Maps Allowed", desc: "Get home without opening Google Maps.", points: 6, done: false },
  { id: "c5", emoji: "💌", title: "Smooth Operator", desc: "Order an entire round in the local language.", points: 5, done: false },
  { id: "c6", emoji: "📸", title: "Evidence", desc: "Take one cursed group photo before midnight.", points: 3, done: false },
];

export const SEED_CHAOS_LOG = [
  {
    id: "log1",
    userId: "u_me",
    homeTime: "04:30",
    languages: 4,
    story: "Tried to explain the EU AI Act to a bouncer in Spanish. He let me in out of pity. Kebab acquired at 4am. 10/10 would regret again.",
    chaos: 9,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "log2",
    userId: "u_me",
    homeTime: "00:45",
    languages: 1,
    story: "Responsible night. Home early. Hydrated. Who even am I.",
    chaos: 2,
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
  },
];

export const SEED_CHAT = [
  { id: "m1", userId: "u_lucia", text: "who has my jacket from saturday 😭", createdAt: Date.now() - 1000 * 60 * 40 },
  { id: "m2", userId: "u_jonas", text: "not me. i lost my OWN jacket", createdAt: Date.now() - 1000 * 60 * 38 },
  { id: "m3", userId: "u_amara", text: "kebab guy asked about you théo", createdAt: Date.now() - 1000 * 60 * 30 },
  { id: "m4", userId: "u_theo", text: "he knows me by name now. this is my erasmus arc", createdAt: Date.now() - 1000 * 60 * 28 },
];

export const SEED_GOSSIP = [
  { id: "g1", userId: "u_kasia", text: "someone in this group cried at the döner place and it was beautiful 🥲", reactions: { "😭": 4, "👑": 2, "🥙": 3 }, createdAt: Date.now() - 1000 * 60 * 120 },
  { id: "g2", userId: "u_jonas", text: "the flat WiFi password is now 'nevermore2026' for reasons we don't discuss", reactions: { "💀": 5, "🔥": 1 }, createdAt: Date.now() - 1000 * 60 * 200 },
  { id: "g3", userId: "u_amara", text: "update: théo and the kebab guy are now LinkedIn connected", reactions: { "🤝": 6, "😂": 4, "🥙": 2 }, createdAt: Date.now() - 1000 * 60 * 300 },
];

export const REACTION_PALETTE = ["😂", "💀", "🔥", "👑", "🥙", "😭", "🤝"];
