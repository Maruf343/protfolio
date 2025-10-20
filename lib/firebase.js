// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb_nXZ5lPyXzxeKkifE5RjtBK0bAtlU5s",
  authDomain: "portfolio-chat-6572e.firebaseapp.com",
  projectId: "portfolio-chat-6572e",
  storageBucket: "portfolio-chat-6572e.firebasestorage.app",
  messagingSenderId: "762637540093",
  appId: "1:762637540093:web:a0741cf5f0c73aef62fc94",
  measurementId: "G-CTX7PB4KLS"
};

// Initialize Firebase (guard against re-initialization in dev/hot-reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth, Firestore and Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics should only be initialized in the browser
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics may fail in some environments (e.g., missing window or blocked by privacy)
    analytics = null;
  }
}

export { app, auth, db, storage, analytics };