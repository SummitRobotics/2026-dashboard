import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "database-d991e.firebaseapp.com",
  projectId: "database-d991e",
  storageBucket: "database-d991e.firebasestorage.app",
  messagingSenderId: "495555471459",
  appId: "1:495555471459:web:0b978df69c23dce652f056"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
