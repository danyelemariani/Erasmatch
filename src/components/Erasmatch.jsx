import React, { useState, useMemo, useRef, useCallback } from "react";
import { MapPin, Calendar, Globe, Heart, X, RotateCcw, Sparkles, Star, Clock, Users, Info } from "lucide-react";
import { COUNTRIES, COUNTRY_FLAGS, OPPORTUNITIES } from "../data/opportunities.js";

const C = {
  blue: "#003399",
  yellow: "#FFCC00",
  ink: "#0A1A4A",
  sky: "#2E6FE8",
  paper: "#F4F6FF",
  white: "#FFFFFF",
  mint: "#1FB58F",
  coral: "#FF5A5F",
  lilac: "#7B5BE0",
};

const gradClasses = [
  "from-teal-400 to-emerald-500",
  "from-purple-500 to-indigo-600",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-orange-500",
  "from-blue-600 to-sky-500",
  "from-amber-400 to-orange-600"
];

function Stars() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 46;
        return (
          <Star key={i} size={10} fill={C.yellow} color={C.yellow}
            style={{ position: "absolute", left: `calc(50% + ${Math.cos(a) * r}px)`, top: `calc(50% + ${Math.sin(a) * r}px)`, transform: "translate(-50%,-50%)" }} />
        );
      })}
    </div>
  );
}

export default function Erasmatch({ onUnlock }) {
  const [stage, setStage] = useState("intro");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState([]);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [flyOff, setFlyOff] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [footerTaps, setFooterTaps] = useState(0);
  const start = useRef(null);
  const pressTimer = useRef(null);
  const toastTimer = useRef(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 1800);
  };

  const matches = useMemo(() => {
    const a = parseInt(age, 10);
    if (!a) return OPPORTUNITIES;
    return OPPORTUNITIES.filter(p => a >= p.minAge && a <= p.maxAge)
      .sort((x, y) => (x.country === country ? -1 : 0) - (y.country === country ? -1 : 0));
  }, [age, country]);

  const current = matches[index];
  const next = matches[index + 1];

  const advance = useCallback((liked) => {
    if (flyOff) return;
    if (liked && current) {
      setSaved(s => {
        if (!s.some(item => item.id === current.id)) {
          triggerToast(`💛 Saved "${current.title}"`);
          return [...s, current];
        }
        return s;
      });
    }
    setFlyOff(liked ? "right" : "left");
    setTimeout(() => {
      if (index + 1 >= matches.length) setStage("done");
      else setIndex(i => i + 1);
      setDrag({ x: 0, y: 0, active: false });
      setFlyOff(null);
    }, 320);
  }, [flyOff, current, index, matches]);

  const onDown = (e) => {
    if (flyOff) return;
    const pt = e.touches ? e.touches[0] : e;
    start.current = { x: pt.clientX, y: pt.clientY };
    setDrag(d => ({ ...d, active: true }));
  };

  const onMove = (e) => {
    if (!start.current) return;
    const pt = e.touches ? e.touches[0] : e;
    setDrag({ x: pt.clientX - start.current.x, y: pt.clientY - start.current.y, active: true });
  };

  const onUp = () => {
    if (Math.abs(drag.x) > 110) advance(drag.x > 0);
    else setDrag({ x: 0, y: 0, active: false });
    start.current = null;
  };

  const rot = drag.x / 18;
  const likeOp = Math.max(0, Math.min(1, drag.x / 110));
  const nopeOp = Math.max(0, Math.min(1, -drag.x / 110));

  const countries = ["", ...Array.from(new Set(OPPORTUNITIES.map(p => p.country)))].sort();

  // Easter egg triggers
  const startPress = () => {
    pressTimer.current = setTimeout(onUnlock, 700);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };
  const tapFooter = () => {
    setFooterTaps(n => {
      const v = n + 1;
      if (v >= 5) {
        onUnlock();
        return 0;
      }
      return v;
    });
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: `radial-gradient(120% 90% at 50% -10%, ${C.sky}22, transparent), ${C.paper}`, fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif", color: C.ink, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        button:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 2px; }
        @keyframes cardIn { from { transform: scale(0.96) translateY(8px); opacity: .4 } to { transform: none; opacity: 1 } }
        @keyframes pop { 0% { transform: scale(1) } 50% { transform: scale(1.05) } 100% { transform: scale(1) } }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div 
          onMouseDown={startPress} 
          onMouseUp={endPress} 
          onMouseLeave={endPress} 
          onTouchStart={startPress} 
          onTouchEnd={endPress}
          style={{ width: 38, height: 38, borderRadius: 11, background: C.blue, display: "grid", placeItems: "center", boxShadow: `0 6px 18px ${C.blue}44`, cursor: "default" }}
        >
          <Star size={20} fill={C.yellow} color={C.yellow} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5, lineHeight: 1 }}>
            Erasmatch<span style={{ color: C.yellow, WebkitTextStroke: `1px ${C.blue}` }}>+</span>
          </div>
          <div style={{ fontSize: 11, color: C.sky, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Swipe your next adventure</div>
        </div>
      </header>

      {/* Stage: Intro */}
      {stage === "intro" && (
        <div style={{ width: "100%", maxWidth: 420, background: C.white, borderRadius: 28, padding: 28, boxShadow: "0 24px 60px #0033991a", border: `1px solid ${C.blue}14` }}>
          <div style={{ position: "relative", height: 120, marginBottom: 8 }}>
            <Stars />
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <Sparkles size={34} color={C.blue} />
            </div>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "4px 0 6px", textAlign: "center" }}>Find your Erasmus+ match</h1>
          <p style={{ textAlign: "center", color: "#5566aa", margin: "0 0 22px", fontSize: 14, lineHeight: 1.5 }}>
            Tell us a little about you. We'll line up youth exchanges, training courses and volunteering you can actually join.
          </p>

          <label style={{ fontSize: 13, fontWeight: 600 }}>Your age</label>
          <input type="number" min={13} max={35} value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 22" style={inputStyle} />

          <label style={{ fontSize: 13, fontWeight: 600, marginTop: 14, display: "block" }}>Your country</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: 13, fontSize: 18 }}>{country ? COUNTRY_FLAGS[country] : <Globe size={16} color={C.sky} style={{ marginTop: 3 }} />}</span>
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, paddingLeft: 40, appearance: "none" }}>
              {countries.map(c => <option key={c} value={c}>{c ? `${COUNTRY_FLAGS[c]}  ${c}` : "Select a country"}</option>)}
            </select>
            <span style={{ position: "absolute", right: 14, top: 16, color: "#9aa8cc", fontSize: 12, pointerEvents: "none" }}>▾</span>
          </div>

          <button onClick={() => { setIndex(0); setSaved([]); setStage("swipe"); }} disabled={!age} style={{ ...btn, width: "100%", marginTop: 22, background: age ? C.blue : "#9fb0d8", color: C.white, fontSize: 16, padding: "15px" }}>
            Show me {matches.length} opportunities →
          </button>
        </div>
      )}

      {/* Stage: Swipe Deck */}
      {stage === "swipe" && current && (
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ display: "flex", justifyBetween: "space-between", justifyContent: "space-between", fontSize: 12, color: "#7385b8", marginBottom: 12, fontWeight: 600 }}>
            <span>{index + 1} / {matches.length}</span>
            <span>{saved.length} saved ❤</span>
          </div>

          <div style={{ position: "relative", height: 500 }}>
            {next && <Card p={next} style={{ transform: "scale(0.95) translateY(14px)", filter: "brightness(0.97)" }} />}
            {current && (
              <Card p={current}
                onMouseDown={onDown} onMouseMove={drag.active ? onMove : undefined} onMouseUp={onUp} onMouseLeave={drag.active ? onUp : undefined}
                onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
                style={
                  flyOff
                    ? {
                        transform: `translate(${flyOff === "right" ? 600 : -600}px, ${drag.y * 0.3 - 40}px) rotate(${flyOff === "right" ? 24 : -24}deg)`,
                        opacity: 0,
                        transition: "transform 0.4s cubic-bezier(.4,0,.6,1), opacity 0.4s ease",
                        cursor: "grab", touchAction: "none",
                      }
                    : {
                        transform: `translate(${drag.x}px, ${drag.y * 0.3}px) rotate(${rot}deg)`,
                        transition: drag.active ? "none" : "transform 0.35s cubic-bezier(.2,.8,.2,1)",
                        cursor: "grab", touchAction: "none",
                        animation: "cardIn 0.4s cubic-bezier(.2,.8,.2,1)",
                      }
                }
                likeOp={flyOff === "right" ? 1 : likeOp} nopeOp={flyOff === "left" ? 1 : nopeOp}
              />
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 22 }}>
            <button onClick={() => advance(false)} style={{ ...round, color: C.coral, border: `2px solid ${C.coral}33` }} aria-label="Skip"><X size={26} /></button>
            <button onClick={() => setActiveModal(current)} style={{ ...round, color: C.sky, border: `2px solid ${C.sky}33` }} aria-label="Information"><Info size={24} /></button>
            <button onClick={() => { setIndex(0); setSaved([]); setStage("intro"); }} style={{ ...round, width: 52, height: 52, color: C.sky, border: `2px solid ${C.sky}33` }} aria-label="Restart"><RotateCcw size={20} /></button>
            <button onClick={() => advance(true)} style={{ ...round, color: C.white, background: C.mint, border: "none", boxShadow: `0 10px 24px ${C.mint}55` }} aria-label="Save"><Heart size={26} fill="white" /></button>
          </div>
          <p style={{ textAlign: "center", color: "#9aa8cc", fontSize: 12, marginTop: 14 }}>Swipe right to save · left to skip</p>
        </div>
      )}

      {/* Stage: Finished */}
      {stage === "done" && (
        <div style={{ width: "100%", maxWidth: 420, background: C.white, borderRadius: 28, padding: 28, boxShadow: "0 24px 60px #0033991a", textAlign: "center" }}>
          <div style={{ position: "relative", height: 100, marginBottom: 6 }}><Stars /><div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><Heart size={32} fill={C.coral} color={C.coral} /></div></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{saved.length ? `${saved.length} project${saved.length > 1 ? "s" : ""} saved` : "All done!"}</h2>
          <p style={{ color: "#5566aa", fontSize: 14, margin: "0 0 20px" }}>{saved.length ? "Your shortlist — apply through your national agency." : "Nothing saved this round. Give it another swipe?"}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, textAlign: "left" }}>
            {saved.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, background: C.paper, border: `1px solid ${p.color}22` }}>
                <div style={{ fontSize: 26 }}>{p.flag}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#7385b8" }}>{p.city}, {p.country} · {p.month || p.dates}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: p.color, background: `${p.color}18`, padding: "4px 8px", borderRadius: 20 }}>{p.type}</span>
              </div>
            ))}
          </div>

          <button onClick={() => { setIndex(0); setSaved([]); setStage("intro"); }} style={{ ...btn, width: "100%", background: C.blue, color: C.white, fontSize: 16, padding: 15 }}>Start over</button>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 28, fontSize: 11, color: "#9aa8cc", textAlign: "center", maxWidth: 360, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
        <button onClick={tapFooter} style={{ background: "none", border: "none", color: "#9aa8cc", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
          © 2026 European Mobility Services
        </button>
        <button onClick={onUnlock} aria-label="Toggle theme" style={{ background: "none", border: "none", color: "#c3ccdf", cursor: "pointer", lineHeight: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        </button>
      </footer>

      {/* Details Modal */}
      {activeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setActiveModal(null)} style={{ position: "absolute", inset: 0, background: "rgba(10, 26, 74, 0.4)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 420, maxHeight: "90vh", background: "#fff", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0, 0, 0, 0.15)" }}>
            <button onClick={() => setActiveModal(null)} style={{ position: "absolute", top: 16, right: 16, zIndex: 110, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center" }}>&times;</button>
            <div style={{ overflowY: "auto", flex: 1 }} className="no-scrollbar">
              <div className={`h-48 relative flex items-end p-6 bg-gradient-to-br ${gradClasses[(activeModal.gradient - 1) % 6]}`}>
                {activeModal.img && <img src={activeModal.img} alt={activeModal.city} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
                  <span style={{ fontSize: 32 }}>{activeModal.flag}</span>
                  <span style={{ fontWeight: 800, fontSize: 20 }}>{activeModal.city}</span>
                </div>
                <span style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.9)", color: C.blue, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20 }}>{activeModal.type}</span>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.ink }}>{activeModal.title}</h3>
                  <span style={{ background: `${C.blue}10`, color: C.blue, fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{activeModal.tags[0]}</span>
                </div>
                <p style={{ fontSize: 14, color: "#5566aa", margin: "0 0 16px", lineHeight: 1.5 }}>{activeModal.summary}</p>
                <div style={{ background: C.paper, borderRadius: 16, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div><span style={{ fontSize: 10, color: "#8fa0d0", textTransform: "uppercase", fontWeight: 700 }}>Dates</span><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{activeModal.dates}</div></div>
                  <div><span style={{ fontSize: 10, color: "#8fa0d0", textTransform: "uppercase", fontWeight: 700 }}>Duration</span><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{activeModal.duration}</div></div>
                  <div><span style={{ fontSize: 10, color: "#8fa0d0", textTransform: "uppercase", fontWeight: 700 }}>Age range</span><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{activeModal.minAge}–{activeModal.maxAge}</div></div>
                  <div><span style={{ fontSize: 10, color: "#8fa0d0", textTransform: "uppercase", fontWeight: 700 }}>Spots</span><div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{activeModal.spots} left</div></div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: "#8fa0d0", textTransform: "uppercase", fontWeight: 800, display: "block", marginBottom: 6 }}>What's covered</span>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#46548a", lineHeight: 1.6 }}>
                    {activeModal.perks ? activeModal.perks.map((perk, i) => <li key={i}>{perk}</li>) : <li>Travel + stay covered</li>}
                  </ul>
                </div>
                <button onClick={() => {
                  setSaved(s => {
                    if (!s.some(item => item.id === activeModal.id)) {
                      triggerToast(`🚀 Application started for "${activeModal.title}"`);
                      return [...s, activeModal];
                    }
                    return s;
                  });
                  setActiveModal(null);
                }} style={{ ...btn, width: "100%", background: C.mint, color: "#fff", padding: "14px", fontSize: 15, boxShadow: `0 8px 20px ${C.mint}33` }}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 80, zIndex: 1000, background: C.ink, color: "#fff", padding: "12px 24px", borderRadius: 24, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 30px rgba(10,26,74,0.25)", animation: "pop 0.3s ease-out" }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function Card({ p, style, likeOp = 0, nopeOp = 0, ...handlers }) {
  return (
    <div {...handlers} style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: C.white, boxShadow: "0 20px 50px #00339922", border: "1px solid #00339914", userSelect: "none", ...style }}>
      <div style={{ height: 200, position: "relative", overflow: "hidden", background: p.color }}>
        <img src={p.img} alt={p.city} draggable={false} onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${p.color}22 0%, transparent 35%, rgba(0,0,0,.45) 100%)` }} />
        <div style={{ position: "absolute", bottom: 12, left: 16, display: "flex", alignItems: "center", gap: 8, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
          <span style={{ fontSize: 30, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.4))" }}>{p.flag}</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{p.city}</span>
        </div>
        <span style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,.92)", color: p.color, fontWeight: 800, fontSize: 11, padding: "6px 12px", borderRadius: 20, letterSpacing: .5 }}>{p.type}</span>
        <span style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,.4)", color: "#fff", fontWeight: 600, fontSize: 11, padding: "6px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{p.minAge}–{p.maxAge}</span>
        <div style={{ position: "absolute", top: 60, right: 24, opacity: likeOp, transform: "rotate(12deg)", border: `4px solid ${C.mint}`, color: C.mint, fontWeight: 900, fontSize: 26, padding: "4px 14px", borderRadius: 12, background: "rgba(255,255,255,.85)" }}>SAVE</div>
        <div style={{ position: "absolute", top: 60, left: 24, opacity: nopeOp, transform: "rotate(-12deg)", border: `4px solid ${C.coral}`, color: C.coral, fontWeight: 900, fontSize: 26, padding: "4px 14px", borderRadius: 12, background: "rgba(255,255,255,.85)" }}>SKIP</div>
      </div>
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 23, fontWeight: 800, lineHeight: 1.1, color: C.ink }}>{p.title}</h3>
          <span style={{ fontSize: 11, fontWeight: 700, color: p.color, background: `${p.color}16`, padding: "5px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{p.topic}</span>
        </div>
        <div style={{ display: "flex", gap: 16, margin: "12px 0", color: "#5566aa", fontSize: 13, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={14} color={p.color} />{p.city}, {p.country}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={14} color={p.color} />{p.month || p.dates}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} color={p.color} />{p.days || p.duration}</span>
        </div>
        <p style={{ color: "#46548a", fontSize: 14, lineHeight: 1.55, margin: "4px 0 14px" }}>{p.desc || p.summary}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${C.yellow}22`, border: `1px solid ${C.yellow}`, borderRadius: 14, padding: "10px 12px" }}>
          <Star size={16} fill={C.yellow} color={C.blue} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{p.funded || p.funding}</span>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 14px", marginTop: 6, borderRadius: 14, border: "1.5px solid #d6def5",
  fontSize: 15, fontFamily: "inherit", color: C.ink, background: "#fbfcff", outline: "none",
};
const btn = { border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
const round = { width: 60, height: 60, borderRadius: "50%", background: C.white, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 8px 20px #00339918", border: "none" };
