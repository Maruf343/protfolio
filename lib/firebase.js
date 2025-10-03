// // lib/firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // ✅ Your Firebase config (you can also move these into .env.local)
// const firebaseConfig = {
//   apiKey: "AIzaSyDb_nXZ5lPyXzxeKkifE5RjtBK0bAtlU5s",
//   authDomain: "portfolio-chat-6572e.firebaseapp.com",
//   projectId: "portfolio-chat-6572e",
//   storageBucket: "portfolio-chat-6572e.appspot.com", // fixed (not .firebasestorage.app)
//   messagingSenderId: "762637540093",
//   appId: "1:762637540093:web:a0741cf5f0c73aef62fc94",
// };

// const app = initializeApp(firebaseConfig);

// // ✅ Export Firestore + Auth
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "portfolio-chat-6572e.firebaseapp.com",
  projectId: "portfolio-chat-6572e",
  storageBucket: "portfolio-chat-6572e.appspot.com",
  messagingSenderId: "762637540093",
  appId: "1:762637540093:web:a0741cf5f0c73aef62fc94",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
