import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Firebase配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 初始化Firebase
export const app = initializeApp(firebaseConfig);
const _auth = getAuth(app);
// export const db = getFirestore(app);
export const db = initializeFirestore(app, {
  host: 'firebase-api.agentverse.cc',
  ssl: true,
  ignoreUndefinedProperties: true, // 这是一个常用的设置，也可以加上
  experimentalForceLongPolling: false, // 另一个可配置项
});
// connectFirestoreEmulator(db, 'firebase-api.agentverce.cc', 443);
connectAuthEmulator(_auth, 'https://firebase-auth-api.agentverse.cc', {
  disableWarnings: true
}); // 确保是正确的 agentverse.cc

export const auth = _auth;