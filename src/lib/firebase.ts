import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

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

// ─────────────────────────────────────────────────────────────────────────
// Firebase App Check — bot/abuse protection for the write paths that don't
// require login (문의/후원신청 폼, 방문자 카운트 등). Uses reCAPTCHA
// Enterprise as the attestation provider (Google's current recommendation —
// the classic reCAPTCHA v3 provider is marked deprecated in the Firebase
// Console as of this integration), which runs invisibly in the background
// (no checkbox/puzzle shown to visitors).
//
// This is intentionally opt-in and fails soft: until
// VITE_RECAPTCHA_ENTERPRISE_SITE_KEY is set, App Check is simply skipped and
// the site behaves exactly as before. See README.md "App Check 설정 방법"
// for the one-time setup steps (creating a reCAPTCHA Enterprise key in
// Google Cloud Console, registering it in Firebase Console > App Check, then
// turning on enforcement for Firestore/Storage once traffic looks normal in
// Monitor mode). Initializing it here is necessary but not sufficient —
// actual enforcement is a separate switch flipped in the Firebase Console;
// without that switch, this only attaches a token that nothing yet checks.
const recaptchaSiteKey = String(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY || '').trim();

if (recaptchaSiteKey) {
  if (import.meta.env.DEV) {
    // reCAPTCHA Enterprise can't attest localhost, so local dev needs a
    // "debug token" instead. Setting this to `true` makes the SDK generate
    // a random token and print it to the browser console the first time
    // the app runs locally — register that value once under Firebase
    // Console > App Check > Apps > (this web app) > Manage debug tokens,
    // and local dev keeps working after that (no need to redo this per
    // machine beyond the one registration).
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error('[firebase] App Check 초기화 실패:', error);
  }
} else if (import.meta.env.PROD) {
  console.warn(
    '[firebase] VITE_RECAPTCHA_ENTERPRISE_SITE_KEY가 설정되지 않아 App Check가 ' +
    '비활성화되어 있습니다. Firebase Console에서 App Check를 등록한 뒤 이 환경변수를 ' +
    '추가하면 자동으로 활성화됩니다. (README.md 참고)'
  );
}

// Firestore WebChannel can hang behind some proxies, antivirus products, or
// restrictive networks. Long polling is slightly less efficient, but is much
// more tolerant of those environments and prevents admin saves from sitting
// indefinitely waiting for the Firestore backend connection.
const firestoreSettings = {
  experimentalForceLongPolling: true,
};

export const db = databaseId
  ? initializeFirestore(app, firestoreSettings, databaseId)
  : initializeFirestore(app, firestoreSettings);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
