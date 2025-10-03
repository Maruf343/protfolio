"use client";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function EmojiPicker({ onEmojiClick }) {
  return (
    <div className="absolute bottom-16 right-0 z-50">
      <Picker onEmojiClick={(_, emoji) => onEmojiClick(emoji.emoji)} />
    </div>
  );
}
