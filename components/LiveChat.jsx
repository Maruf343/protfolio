

"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { FaFacebookMessenger, FaUserEdit, FaPaperPlane, FaSmile, FaHeart, FaThumbsUp, FaSadTear, FaCircle } from "react-icons/fa";
import EmojiPicker from "./EmojiPicker";

const ADMIN_NAME = "Maruf";

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [chatWidth, setChatWidth] = useState(384);
  const [online, setOnline] = useState(true);

  // Online/offline status
  useEffect(() => {
    setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", () => setOnline(true));
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", () => setOnline(true));
    };
  }, []);

  // Set guest name on first load
  useEffect(() => {
    const storedName = localStorage.getItem("guestName");
    if (storedName) {
      setGuestName(storedName);
    } else {
      const randomName = `Guest${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem("guestName", randomName);
      setGuestName(randomName);
    }
  }, []);

  // Real-time Firestore messages
  useEffect(() => {
    if (!open) return;
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [open]);

  // Notification on new message
  useEffect(() => {
    if (!open || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.user !== guestName) {
      if (window.Notification && Notification.permission === "granted") {
        new Notification(`${lastMsg.user}: ${lastMsg.text}`);
      } else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, [messages, open, guestName]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      user: guestName,
      timestamp: serverTimestamp(),
      reactions: [],
    });
    setNewMessage("");
  };

  // Edit guest name
  const handleNameEdit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    localStorage.setItem("guestName", guestName);
    setEditingName(false);
  };

  // Messenger-style: only one reaction per user per message
  const addReaction = async (msgId, emoji) => {
    const msgDoc = doc(db, "messages", msgId);
    // Remove previous reaction by this user, then add new one
    const msgSnap = await msgDoc.get();
    let reactions = [];
    if (msgSnap.exists()) {
      reactions = msgSnap.data().reactions || [];
      reactions = reactions.filter(r => r.user !== guestName);
    }
    reactions.push({ user: guestName, type: emoji });
    await updateDoc(msgDoc, { reactions });
  };

  return (
    <>
      {/* Floating Messenger Icon */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Messenger Chat"
      >
        <FaFacebookMessenger size={32} />
      </button>

      {/* Messenger Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in"
          style={{ width: chatWidth, maxWidth: "100%" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 font-semibold">
            <span>Messenger Chat</span>
            <span className="flex items-center gap-2 text-xs">
              <FaCircle className={online ? "text-green-400" : "text-gray-400"} />
              {online ? "Online" : "Offline"}
            </span>
            <button
              className="text-white hover:text-gray-200"
              onClick={() => setOpen(false)}
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          {/* Name Edit */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-indigo-600">You:</span>
            {editingName ? (
              <form onSubmit={handleNameEdit} className="flex gap-2">
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="text-blue-600 font-bold">Save</button>
              </form>
            ) : (
              <span className="text-gray-800 dark:text-gray-200">{guestName}</span>
            )}
            <button
              className="ml-2 text-indigo-600 hover:text-indigo-800"
              onClick={() => setEditingName(true)}
              aria-label="Edit Name"
            >
              <FaUserEdit />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96 bg-gray-50 dark:bg-gray-800">
            {messages.length === 0 && (
              <p className="text-center text-gray-500">No messages yet...</p>
            )}
            {messages.map((msg) => {
              // Only one reaction per user per message
              const userReaction = msg.reactions?.find(r => r.user === guestName)?.type;
              // Group reactions by type and count
              const reactionCounts = {};
              if (msg.reactions) {
                msg.reactions.forEach(r => {
                  if (!reactionCounts[r.type]) reactionCounts[r.type] = [];
                  reactionCounts[r.type].push(r.user);
                });
              }
              // Restore original bubble style and button appearance
              const bubbleClass = `px-3 py-2 rounded-lg shadow max-w-xs relative ${msg.user === guestName ? "bg-blue-600 text-white" : msg.user === ADMIN_NAME ? "bg-green-100 text-green-900" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`;
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.user === guestName ? "justify-end" : "justify-start"}`}
                >
                  <div className={bubbleClass}>
                    <span className="block text-xs font-semibold mb-1">{msg.user === guestName ? "You" : msg.user}</span>
                    {/* Link detection: render URLs as clickable links */}
                    <span>
                      {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                        part.match(/https?:\/\/[^\s]+/) ? (
                          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-blue-500 hover:text-blue-700">{part}</a>
                        ) : part
                      )}
                    </span>
                    {/* Messenger-style reactions: only one per user */}
                    <div className="absolute -bottom-6 left-0 flex gap-1">
                      <button title="Love" onClick={() => addReaction(msg.id, "love")}><FaHeart className={`text-red-500 ${userReaction === "love" ? "" : "opacity-50"}`} /></button>
                      <button title="Like" onClick={() => addReaction(msg.id, "like")}><FaThumbsUp className={`text-blue-500 ${userReaction === "like" ? "" : "opacity-50"}`} /></button>
                      {/* Show all reactions with counts */}
                      {Object.entries(reactionCounts).filter(([type]) => type === "love" || type === "like").map(([type, users]) => (
                        <span key={type} className="ml-2 text-lg flex items-center gap-1">
                          {type === "love" && <FaHeart className="text-red-500" />}
                          {type === "like" && <FaThumbsUp className="text-blue-500" />}
                          <span className="text-xs">{users.length}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-3 flex gap-2 border-t border-gray-200 dark:border-gray-700 relative">
            <button
              type="button"
              className="text-xl px-2 text-yellow-500 hover:text-yellow-600"
              onClick={() => setShowEmoji((v) => !v)}
              aria-label="Pick Emoji"
            >
              <FaSmile />
            </button>
            {/* Reduced emoji picker: only show a small set inline */}
            {showEmoji && (
              <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded shadow p-2 z-50 flex gap-2">
                {["😀","😂","😍","👍","🙏","🔥","🎉","😎","🥳","😢"].map(e => (
                  <button key={e} className="text-2xl" onClick={() => { setNewMessage(newMessage + e); setShowEmoji(false); }}>{e}</button>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              aria-label="Send"
            >
              <FaPaperPlane />
            </button>
          </form>
          {/* Chat size controls */}
          <div className="flex justify-end gap-2 px-3 pb-2 text-xs text-gray-500">
            <span>Size:</span>
            <button onClick={() => setChatWidth(320)} className="px-2">S</button>
            <button onClick={() => setChatWidth(384)} className="px-2">M</button>
            <button onClick={() => setChatWidth(480)} className="px-2">L</button>
          </div>
        </div>
      )}
      {/* Animation style */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
