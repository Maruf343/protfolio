"use client";

import React, { useRef, useState } from "react";
import { FaPaperPlane, FaImage, FaSmile } from "react-icons/fa";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef();
  const typingTimeout = useRef();


  const submit = (e) => {
    e?.preventDefault?.();
    if (!text.trim()) return;
    onSend({ text: text.trim(), type: "text" });
    setText("");
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Pass the file to parent for upload
    onSend({ text: "", type: "image" }, file);
  };

  const handleTyping = (val) => {
    if (onTyping) {
      onTyping(true);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => onTyping(false), 1200);
    }
  };

  const onEmojiClick = (emojiObject) => {
    // emoji-picker-react v4 uses a single object param
    setText((t) => t + emojiObject.emoji);
  };

  return (
    <form onSubmit={submit} className="border-t p-3 bg-white dark:bg-gray-800 flex items-center gap-3">
      <button type="button" onClick={() => setShowEmoji((s) => !s)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <FaSmile />
      </button>

  <input type="text" value={text} onChange={(e) => { setText(e.target.value); handleTyping(e.target.value); }} placeholder="Type a message..." className="flex-1 px-4 py-2 rounded-full border bg-gray-100 dark:bg-gray-700" />

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button type="button" onClick={() => fileRef.current?.click()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><FaImage /></button>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full"><FaPaperPlane /></button>

      {showEmoji && (
        <div className="absolute bottom-20 left-10 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </form>
  );
}
