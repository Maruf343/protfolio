"use client";

import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function MessageList({ messages, currentUser, typingUsers }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  // mark visible messages as seen
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          const group = entry.target.getAttribute("data-group");
          const msg = messages.find(m => m.id === id);
          if (msg && !msg.seen) {
            try {
              await updateDoc(doc(db, "groups", group || "general", "messages", id), { seen: true });
            } catch (e) {}
          }
        }
      });
    }, { root: ref.current, threshold: 0.6 });

    const items = Array.from(ref.current.querySelectorAll("[data-id]"));
    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
      {messages.map((m) => (
        <div key={m.id} data-id={m.id} data-group={m.groupId || "general"}>
          <MessageBubble msg={m} isMe={currentUser?.uid === m.senderId || (!currentUser && m.senderId === "guest")} />
        </div>
      ))}

      {Object.keys(typingUsers).length > 0 && (
        <div className="text-sm text-gray-500">{Object.keys(typingUsers).join(", ")} is typing...</div>
      )}
    </div>
  );
}
