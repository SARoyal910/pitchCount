import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQFxeJT4MB6fruEj8tHzUPdjrAG5pjI1E",
  authDomain: "pitchcount-c3801.firebaseapp.com",
  projectId: "pitchcount-c3801",
  storageBucket: "pitchcount-c3801.firebasestorage.app",
  messagingSenderId: "451939474230",
  appId: "1:451939474230:web:ad42f2db5e1a155cf97197",
  measurementId: "G-EF7ZYJD6FZ",
};

// Prevent re-init during Fast Refresh
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getApps().length
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

// ✅ Firestore instance for your app
export const db = getFirestore(app);
export { auth };
