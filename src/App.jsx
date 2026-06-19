import React, { useState, useCallback } from "react";
import Erasmatch from "./components/Erasmatch.jsx";
import NightMode from "./components/NightMode.jsx";

export default function App() {
  const [mode, setMode] = useState("front"); // front | revealing | night
  const [back, setBack] = useState(false); // transition back overlay

  const unlock = useCallback(() => {
    setMode("revealing");
    // brief flash before night mode mounts
    setTimeout(() => setMode("night"), 650);
  }, []);

  const hide = useCallback(() => {
    setBack(true);
    setTimeout(() => {
      setMode("front");
      setBack(false);
    }, 400);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-night">
      {mode === "front" && <Erasmatch onUnlock={unlock} />}

      {mode === "revealing" && <RevealSplash />}

      {mode === "night" && <NightMode onDisguise={hide} />}

      {/* fade-to-corporate overlay when hiding */}
      {back && (
        <div className="fixed inset-0 z-50 bg-corp-bg flex items-center justify-center animate-[pop_0.4s_ease]">
          <span className="text-corp-header/60 text-sm font-corp">Loading your documents…</span>
        </div>
      )}
    </div>
  );
}

function RevealSplash() {
  return (
    <div className="fixed inset-0 z-50 bg-night flex flex-col items-center justify-center overflow-hidden">
      {/* neon burst */}
      <div className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(177,74,255,0.5), transparent 55%), radial-gradient(circle at 30% 70%, rgba(255,45,149,0.4), transparent 50%), radial-gradient(circle at 70% 30%, rgba(34,224,255,0.35), transparent 50%)",
        }}
      />
      <div className="relative text-center animate-pop">
        <div className="text-6xl mb-3 animate-floaty">🌙</div>
        <h1 className="text-3xl font-black text-white font-display">
          you found it
        </h1>
        <p className="text-neon-cyan font-semibold mt-1 tracking-widest text-sm">
          ENTERING NIGHT MODE…
        </p>
      </div>
    </div>
  );
}
