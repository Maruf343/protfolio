"use client";

import React from "react";
import Image from "next/image";

const conversations = [
  { id: "general", name: "General", avatar: "/maruf.4a8a93e2.png", last: "Welcome to the chat", time: "Now", unread: 0 },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="w-80 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-bold">Chats</h2>
      </div>
      <div className="p-2">
        {conversations.map((c) => (
          <div key={c.id} onClick={() => onSelect(c.id)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${active === c.id ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
            <Image src={c.avatar} alt={c.name} width={48} height={48} className="rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500 ml-auto">{c.time}</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">{c.last}</div>
            </div>
            {c.unread > 0 && <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">{c.unread}</div>}
          </div>
        ))}
      </div>
    </aside>
  );
}
