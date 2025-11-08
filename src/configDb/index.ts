import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvdgz2z4Mqo8I9D7IlrjMCfLT7zJAP3ps",
  authDomain: "mini-blog-bdfef.firebaseapp.com",
  projectId: "mini-blog-bdfef",
  storageBucket: "mini-blog-bdfef.firebasestorage.app",
  messagingSenderId: "257870137829",
  appId: "1:257870137829:web:f818e9411cf1bd6f5ac70c",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, signInWithPopup, signOut, addDoc };
