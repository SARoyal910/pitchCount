import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const firebaseConfig = extra.firebase ?? {};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error(
    "Missing Firebase config. Check app.config.js and your .env values."
  );
}

// Prevent re-init during Fast Refresh
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (err) {
    const error = err as { code?: string };
    if (error?.code === "auth/already-initialized") {
      auth = getAuth(app);
    } else {
      throw err;
    }
  }
}

// ✅ Firestore instance for your app
export const db = getFirestore(app);
export { auth };
