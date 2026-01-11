import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuild", 
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we are in missing-env state to warn
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn("Firebase API Key is missing. Using dummy key. This is fine for build, but app will fail at runtime.");
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  // Only initialize analytics on the client
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
      isSupported().then(yes => yes && (analytics = getAnalytics(app)));
  });
}

export { app, auth, db, analytics };
