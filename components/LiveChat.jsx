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
  getDoc,
} from "firebase/firestore";
import {
  FaFacebookMessenger,
  FaUserEdit,
  FaPaperPlane,
  FaSmile,
  FaHeart,
  FaThumbsUp,
  FaCircle,
} from "react-icons/fa";

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
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chatTheme") || "system";
    }
    return "system";
  });
  const [guests, setGuests] = useState([]); // Multi-user
  const [activeGuest, setActiveGuest] = useState(null);
  const isAdmin = guestName === ADMIN_NAME;

  // Theme class
  const getThemeClass = () => {
    if (theme === "dark") return "chat-theme-dark";
    if (theme === "light") return "chat-theme-light";
    return "";
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    localStorage.setItem("chatTheme", e.target.value);
  };

  // Online status
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

  // Guest name
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

  // Firestore messages
  useEffect(() => {
    if (!open) return;
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(allMsgs);

      const guestSet = new Set();
      allMsgs.forEach((msg) => {
        if (msg.user !== ADMIN_NAME) guestSet.add(msg.user);
      });
      setGuests(Array.from(guestSet));

      if (isAdmin && !activeGuest && guestSet.size > 0) {
        setActiveGuest(Array.from(guestSet)[0]);
      }
    });
    return () => unsubscribe();
  }, [open, activeGuest]);

  // Notifications
  useEffect(() => {
    if (!open || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.user !== guestName) {
      if (window.Notification && Notification.permission === "granted") {
        new Notification(`${lastMsg.user}: ${lastMsg.text}`);
      } else if (
        window.Notification &&
        Notification.permission !== "denied"
      ) {
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
      to: activeGuest || ADMIN_NAME,
      timestamp: serverTimestamp(),
      reactions: [],
    });
    setNewMessage("");
  };

  // Edit name
  const handleNameEdit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    localStorage.setItem("guestName", guestName);
    setEditingName(false);
  };

  // Add reaction
  const addReaction = async (msgId, emoji) => {
    const msgDoc = doc(db, "messages", msgId);
    const msgSnap = await getDoc(msgDoc);
    let reactions = [];
    if (msgSnap.exists()) {
      reactions = msgSnap.data().reactions || [];
      reactions = reactions.filter((r) => r.user !== guestName);
    }
    reactions.push({ user: guestName, type: emoji });
    await updateDoc(msgDoc, { reactions });
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4"
        onClick={() => setOpen((o) => !o)}
      >
        <FaFacebookMessenger size={32} />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 rounded-3xl shadow-2xl border flex overflow-hidden animate-fade-in chat-responsive ${getThemeClass()}`}
          style={{
            width: isAdmin ? chatWidth + 120 : chatWidth,
            maxWidth: "100%",
          }}
        >
          {/* Sidebar for Admin */}
{isAdmin && (
  <div className="w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col py-4">
    <h2 className="px-4 pb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      Chats
    </h2>
    <div className="flex-1 overflow-y-auto">
      {guests.map((g) => (
        <button
          key={g}
          onClick={() => setActiveGuest(g)}
          className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-800 transition ${
            activeGuest === g ? "bg-blue-100 dark:bg-gray-800" : ""
          }`}
        >
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-500 text-white flex items-center justify-center font-bold mr-3">
            {g.charAt(0).toUpperCase()}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </div>

          {/* Name + Preview */}
          <div className="flex-1 min-w-0">
            <p
              className={`truncate font-medium ${
                activeGuest === g
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {g}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {activeGuest === g ? "Active now" : "Tap to chat"}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
)}


          {/* Main Chat */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 font-semibold shadow-md z-10">
              <span className="flex items-center gap-2">
                <FaFacebookMessenger /> Messenger
              </span>
              <span className="flex items-center gap-1 text-xs">
                <FaCircle className={online ? "text-green-400" : "text-gray-400"} />
                {online ? "Online" : "Offline"}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setShowSettings((s) => !s)}>⚙️</button>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>
            </div>

            {/* Settings */}
            {showSettings && (
              <div className="px-4 py-2 border-b">
                <span className="mr-2">Theme:</span>
                <select
                  value={theme}
                  onChange={handleThemeChange}
                  className="rounded px-2 py-1"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            )}

            {/* Name Edit */}
            <div className="flex items-center gap-3 px-4 py-2 border-b">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold">
                {guestName.charAt(0).toUpperCase()}
              </div>
              {editingName ? (
                <form onSubmit={handleNameEdit} className="flex gap-2">
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="px-2 py-1 rounded border"
                    autoFocus
                  />
                  <button type="submit" className="text-blue-600 font-bold">
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <span className="font-bold">{guestName}</span>
                  <button onClick={() => setEditingName(true)}>
                    <FaUserEdit />
                  </button>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {(isAdmin
                ? messages.filter(
                    (msg) =>
                      (msg.user === ADMIN_NAME && msg.to === activeGuest) ||
                      (msg.user === activeGuest && msg.to === ADMIN_NAME)
                  )
                : messages.filter(
                    (msg) =>
                      (msg.user === ADMIN_NAME && msg.to === guestName) ||
                      (msg.user === guestName && msg.to === ADMIN_NAME)
                  )
              ).map((msg) => {
                const userReaction = msg.reactions?.find(
                  (r) => r.user === guestName
                )?.type;
                const reactionCounts = {};
                msg.reactions?.forEach((r) => {
                  if (!reactionCounts[r.type]) reactionCounts[r.type] = [];
                  reactionCounts[r.type].push(r.user);
                });

                const isMe = msg.user === guestName;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                        {msg.user.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-3xl shadow text-sm ${
                        isMe
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                          : msg.user === ADMIN_NAME
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white rounded-bl-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[10px] opacity-70 mt-1 block text-right">
                        {msg.timestamp
                          ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Sending..."}
                      </span>
                      {/* Reactions under bubble */}
                      {msg.reactions?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {Object.entries(reactionCounts).map(([type, users]) => (
                            <span
                              key={type}
                              className="text-xs flex items-center gap-1 bg-white/70 rounded-full px-2 py-0.5 shadow"
                            >
                              {type === "love" && "❤️"}
                              {type === "like" && "👍"}
                              <span>{users.length}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2 px-4 py-3 border-t bg-white dark:bg-gray-900"
            >
              <button
                type="button"
                className="text-2xl text-gray-500 hover:text-yellow-500"
                onClick={() => setShowEmoji((v) => !v)}
              >
                <FaSmile />
              </button>
              {showEmoji && (
                <div className="absolute bottom-20 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 z-50 flex gap-2">
                  {["😀","😂","😍","👍","🙏","🔥","🎉","😎","🥳","😢"].map((e) => (
                    <button
                      key={e}
                      className="text-2xl hover:scale-110 transition"
                      onClick={() => {
                        setNewMessage(newMessage + e);
                        setShowEmoji(false);
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .chat-theme-dark {
          background: #181a20;
          color: #fff;
        }
        .chat-theme-light {
          background: #fff;
          color: #222;
        }
      `}</style>
    </>
  );
}
