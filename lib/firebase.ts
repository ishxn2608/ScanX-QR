import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "qr-verification-7fe0c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "qr-verification-7fe0c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "qr-verification-7fe0c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "140713435971",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:140713435971:web:f6e2bee4cb5adafbed45f6",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
