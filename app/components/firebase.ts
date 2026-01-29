import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApl7KffIOEn1ZL20lFO5kSiuFfzhiZ_-Q",
    authDomain: "leaderboard-66713.firebaseapp.com",
    projectId: "leaderboard-66713",
    storageBucket: "leaderboard-66713.firebasestorage.app",
    messagingSenderId: "1050366017824",
    appId: "1:1050366017824:web:b206a00752fd289e97d745",
    measurementId: "G-N33Y47YXEQ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };