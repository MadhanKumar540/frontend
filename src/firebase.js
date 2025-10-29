// Firebase setup using SDK v12 modular imports
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDh60ha_x6ZBFdicTb268kkIECHgAWwlME",
  authDomain: "voterc-c70d1.firebaseapp.com",
  projectId: "voterc-c70d1",
  storageBucket: "voterc-c70d1.firebasestorage.app",
  messagingSenderId: "488886767779",
  appId: "1:488886767779:web:c7abc68d48eed56d776f16",
  measurementId: "G-1LVLBJ2JWM"
};

const app = initializeApp(firebaseConfig);

// Initialize auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics - only initialize if in browser and not in test environment
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export default app;
