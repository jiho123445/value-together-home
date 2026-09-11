import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// All Firebase configuration comes from environment variables (.env.local /
// Vercel Environment Variables) rather than a committed JSON file. This is
// a deliberate change from the reference project this codebase was built
// from: that project checked a `firebase-applet-config.json` file into the
// repo. Firebase web config values are not secrets in the classic sense
// (real access control lives in firestore.rules / storage.rules, not in
// hiding these values), but keeping them out of source control still
// matters here: it makes it impossible to accidentally point a fork or a
// copy-pasted repo at the wrong Firebase project, and it matches this
// project's own rule that "every environment value lives in .env.local /
// Vercel env vars, never hardcoded in source."
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const databaseId = String(import.meta.env.VITE_FIREBASE_DATABASE_ID || '').trim();

if (!firebaseConfig.projectId && import.meta.env.PROD) {
  // Fail loudly in production rather than silently initializing a broken
  // Firebase app — a missing env var here would otherwise surface only as
  // confusing downstream Firestore/Auth errors with no obvious cause.
  console.error(
    '[firebase] VITE_FIREBASE_PROJECT_ID is not set. Check your Vercel ' +
    'Environment Variables (see .env.example).'
  );
}

const app = initializeApp(firebaseConfig);

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
