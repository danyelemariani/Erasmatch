import React, { useState, useRef, useEffect } from "react";
import { useStore, memberById } from "../context/store.jsx";
import { SectionTitle, timeAgo } from "./ui.jsx";

export default function GroupChat() {
  const { chat, sendMessage, members, currentUser } = useStore();
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  function submit() {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  }

  return (
    <section>
      <SectionTitle emoji="💬" sub="The flat group chat. Chaos in real time.">
        Group Chat
      </SectionTitle>

      <div className="rounded-3xl bg-nightcard border border-white/5 flex flex-col h-[360px]">
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5">
          {chat.map((m) => {
            const isMe = m.userId === currentUser.id;
            const u = memberById(members, m.userId);
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  {!isMe && (
                    <span className="text-[10px] text-white/40 ml-2 mb-0.5">
                      {u.emoji} {u.name}
                    </span>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-snug ${
                      isMe
                        ? "bg-gradient-to-r from-neon-pink to-neon-purple text-night font-medium rounded-br-sm"
                        : "bg-nightcard2 text-white/90 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-white/25 mt-0.5 mx-2">{timeAgo(m.createdAt)}</span>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="p-2.5 border-t border-white/5 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type something cursed…"
            className="flex-1 rounded-full bg-nightcard2 border border-white/10 px-4 py-2 text-white placeholder-white/25 outline-none focus:border-neon-cyan text-sm"
          />
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="h-10 w-10 shrink-0 rounded-full grid place-items-center bg-neon-cyan text-night font-black disabled:opacity-40 active:scale-90 transition-transform"
            aria-label="Send"
          >
            ↑
          </button>
        </div>
      </div>
    </section>
  );
}
