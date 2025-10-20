"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthProvider";

const reactions = ["❤", "😆", "😮", "😢", "👍"];

export default function MessageBubble({ msg, isMe }) {
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();

  return (
    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <Image src={msg.senderAvatar || "/default-avatar.png"} alt="avatar" width={36} height={36} className="rounded-full" />
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`px-4 py-2 rounded-2xl max-w-[70%] ${isMe ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"}`} onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
        {msg.type === "image" && msg.fileUrl ? (
          // Simple responsive image
          <div className="w-[220px] h-auto rounded overflow-hidden">
            <img src={msg.fileUrl} alt="attachment" className="w-full h-auto object-cover" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{msg.text}</div>
        )}

        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
          <span>{msg.timestamp?.toDate?.()?.toLocaleTimeString?.()}</span>
          <span className="ml-1">{msg.seen ? "✔✔" : msg.delivered ? "✔" : ""}</span>
        </div>

        {showReactions && (
          <div className="flex gap-2 mt-2">
            {reactions.map((r) => (
              <button key={r} className="text-lg" title={r} onClick={async () => {
                try {
                  const messageRef = doc(db, "groups", msg.groupId || "general", "messages", msg.id);
                  const userId = user?.uid || "guest";
                  const reactions = msg.reactions || {};
                  // Toggle reaction for this user
                  const existing = reactions[r] || [];
                  const hasIt = existing.includes(userId);
                  const next = hasIt ? existing.filter((id) => id !== userId) : [...existing, userId];
                  const updated = { ...reactions, [r]: next };
                  await updateDoc(messageRef, { reactions: updated });
                } catch (e) {
                  console.error(e);
                }
              }}>
                {r} {msg.reactions && msg.reactions[r] ? msg.reactions[r].length : ""}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
