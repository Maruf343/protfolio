"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "./chat/ChatWindow";
import { AuthProvider, useAuth } from "../contexts/AuthProvider";
import { FaFacebookMessenger } from "react-icons/fa";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, getDocs, updateDoc, where, writeBatch } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

function InnerChatController({ open, setOpen }) {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevCountRef = useRef(0);
  const intentionallyMinimizedRef = useRef(false);
  const openedOnceRef = useRef(false);
  const ADMIN_EMAIL = "abdullah.almaruf1121@gmail.com";

  useEffect(() => {
    const msgsRef = collection(db, "groups", "general", "messages");
    const q = query(msgsRef, orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const uid = user?.uid || "guest";
      const unreadCount = docs.filter((m) => !m.seen && m.senderId !== uid).length;
      setUnread(unreadCount);

      // detect new message arrival (compare total count)
      const prev = prevCountRef.current;
      if (prev !== 0 && docs.length > prev) {
        const last = docs[docs.length - 1];
        if (last && last.senderId !== uid) {
          // pulse badge
          setPulse(true);
          setTimeout(() => setPulse(false), 1400);

          // auto-open only if user is NOT actively viewing page and hasn't intentionally minimized
          if (!open && document.visibilityState !== "visible" && !intentionallyMinimizedRef.current) {
            setOpen(true);
          }
        }
      }
      prevCountRef.current = docs.length;
    });
    return () => unsub();
  }, [user, open, setOpen]);

  // keyboard shortcuts: ESC closes, Ctrl/Cmd+M toggles
  useEffect(() => {
    const handler = (e) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isMod = (isMac && e.metaKey) || (!isMac && e.ctrlKey);
      if ((isMod && e.key.toLowerCase() === 'm')) {
        e.preventDefault();
        setOpen((s) => !s);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        intentionallyMinimizedRef.current = true;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setOpen]);

  // mark unseen messages read when opening using a filtered query and a batch update
  useEffect(() => {
    if (!open) return;
    const markUnread = async () => {
      try {
        const uid = user?.uid || "guest";
        const msgsRef = collection(db, "groups", "general", "messages");
        const q = query(msgsRef, where("seen", "==", false), orderBy("timestamp", "asc"));
        const snap = await getDocs(q);
        if (snap.empty) return;
        const batch = writeBatch(db);
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.senderId !== uid) batch.update(d.ref, { seen: true });
        });
        await batch.commit();
      } catch (e) {
        // ignore
      }
    };
    markUnread();
  }, [open, user]);

  return (
    <div>
      {/* Floating messenger button */}
      <div>
        <button aria-label="Toggle chat" onClick={() => {
          console.log("Messenger button clicked");
          // if currently open, user intentionally minimized
          setOpen((o) => {
            const next = !o;
            intentionallyMinimizedRef.current = o; // if closing now, mark minimized true
            if (next) intentionallyMinimizedRef.current = false; // opening manually resets
            return next;
          });
        }} className={`fixed right-6 bottom-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center ${pulse ? "animate-pulse" : ""}`}>
          <FaFacebookMessenger size={24} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unread > 99 ? "99+" : unread}</span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} transition={{ duration: 0.22 }} style={{ position: 'fixed', right: 20, top: Math.max(window.innerHeight * 0.12, 60), zIndex: 9999 }}>
              {/* Debug: ChatWindow render */}
              {console.log("ChatWindow rendered")}
              <ChatWindow onClose={() => setOpen(false)} onToggle={() => setOpen((s) => !s)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// keyboard shortcuts (global) will be handled inside InnerChatController via effect

export default function LiveChatWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <InnerChatController open={open} setOpen={setOpen} />
      </div>
    </AuthProvider>
  );
}
