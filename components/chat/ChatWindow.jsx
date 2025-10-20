"use client";

import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../contexts/AuthProvider";
import { db, storage } from "../../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

import { FaTimes, FaBell, FaBellSlash } from "react-icons/fa";

export default function ChatWindow({ defaultWidth = 900, defaultHeight = 600, onClose, startX, startY, onToggle }) {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [muted, setMuted] = useState(false);
  const [activeConversation, setActiveConversation] = useState("general");
  const [typingUsers, setTypingUsers] = useState({});
  const [firebaseError, setFirebaseError] = useState(null);
  const rndRef = useRef();
  const audioRef = useRef(null);

  useEffect(() => {
    // read mute preference
    if (typeof window !== 'undefined') {
      const m = localStorage.getItem('chatMuted');
      setMuted(m === 'true');
    }

    let unsub = () => {};
    try {
      if (!db) {
        setFirebaseError('Messenger is not available: Firebase is not initialized.');
        return;
      }
      const msgsRef = collection(db, "groups", activeConversation, "messages");
      const q = query(msgsRef, orderBy("timestamp", "asc"));
      unsub = onSnapshot(q, (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, groupId: activeConversation, ...d.data() }));
        // Play notification only for newly added messages (not initial load)
        if (messages.length && arr.length > messages.length && audioRef.current && !muted) {
          try { audioRef.current.currentTime = 0; audioRef.current.play(); } catch (e) {}
        }
        setMessages(arr);

        // mark delivered for current user if there are undelivered messages
        snap.docs.forEach(async (docSnap) => {
          const data = docSnap.data();
          if (data.senderId !== (user?.uid || "guest") && !data.delivered) {
            try {
              await updateDoc(doc(db, "groups", activeConversation, "messages", docSnap.id), { delivered: true });
            } catch (e) {
              // ignore
            }
          }
        });
      });
    } catch (e) {
      setFirebaseError('Messenger is not available: Firebase connection failed.');
    }
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation, user]);

  // typing listener
  useEffect(() => {
    if (!db) return;
    const typingRef = collection(db, "groups", activeConversation, "typing");
    const unsubT = onSnapshot(typingRef, (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        map[d.id] = d.data();
      });
      setTypingUsers(map);
    });
    return () => unsubT();
  }, [activeConversation]);

  if (firebaseError) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 text-center p-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2 text-red-600">Messenger Unavailable</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{firebaseError}</p>
          <p className="text-sm text-gray-500">Please check your Firebase configuration in <code>.env.local</code> and reload the page.</p>
        </div>
      </div>
    );
  }
  return (
    <Rnd default={{ x: typeof startX === 'number' ? startX : 50, y: typeof startY === 'number' ? startY : 50, width: defaultWidth, height: defaultHeight }} minWidth={320} minHeight={320} bounds="window" className="shadow-2xl rounded-xl overflow-hidden">
      <div className="flex h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Sidebar active={activeConversation} onSelect={(c) => setActiveConversation(c)} />
        <div className="flex-1 flex flex-col">
          <div className="border-b p-3 flex items-center gap-3">
            <h3 className="font-semibold">{activeConversation === "general" ? "General" : activeConversation}</h3>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-sm text-gray-500">{messages.length} messages</div>
              {/* unread badge (simple count of unseen messages) */}
              {messages.filter(m => !m.seen && m.senderId !== (user?.uid || 'guest')).length > 0 && (
                <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{messages.filter(m => !m.seen && m.senderId !== (user?.uid || 'guest')).length}</div>
              )}
              {/* mute toggle */}
              <button onClick={() => { const next = !muted; setMuted(next); localStorage.setItem('chatMuted', String(next)); }} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                {muted ? <FaBellSlash /> : <FaBell />}
              </button>
              {/* Sign in/out inside header */}
              {!user ? (
                <button onClick={() => signInWithGoogle?.()} className="px-3 py-1 bg-blue-600 text-white rounded">Sign in</button>
              ) : (
                <div className="flex items-center gap-2">
                  {user.email === "abdullah.almaruf1121@gmail.com" && <span className="bg-yellow-400 text-black px-2 py-1 rounded">Admin</span>}
                  <button onClick={() => signOutUser?.()} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Sign out</button>
                </div>
              )}
              {onClose && (
                <button onClick={() => onClose()} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <MessageList messages={messages} currentUser={user} typingUsers={typingUsers} />

          <ChatInput onTyping={async (isTyping) => {
            // write typing presence
            try {
              const uid = user?.uid || "guest";
              const refDoc = doc(db, "groups", activeConversation, "typing", uid);
              if (isTyping) {
                await setDoc(refDoc, { name: user?.displayName || "Guest", ts: serverTimestamp() });
              } else {
                // remove typing doc
                try { await deleteDoc(refDoc); } catch (e) { /* ignore */ }
              }
            } catch (e) {}
          }} onSend={async (payload, file) => {
            try {
              let fileUrl = payload.fileUrl || null;
              if (file) {
                const path = `messages/${activeConversation}/${Date.now()}_${file.name}`;
                const storageRef = sRef(storage, path);
                await uploadBytes(storageRef, file);
                fileUrl = await getDownloadURL(storageRef);
              }

              const docRef = await addDoc(collection(db, "groups", activeConversation, "messages"), {
                text: payload.text || "",
                type: payload.type || (fileUrl ? "image" : "text"),
                fileUrl: fileUrl || null,
                senderId: user?.uid || "guest",
                senderName: user?.displayName || payload.senderName || "Guest",
                senderAvatar: user?.photoURL || payload.senderAvatar || null,
                timestamp: serverTimestamp(),
                seen: false,
                delivered: false,
                reactions: {},
              });

              // Optionally update local state optimistically
            } catch (err) {
              console.error(err);
            }
          }} />
        </div>
      </div>
    </Rnd>
  );
}
