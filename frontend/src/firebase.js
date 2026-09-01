// MaatBhasha — Firebase configuration
// Replace placeholders below with your actual Firebase project values.
// NEVER commit real credentials to version control.

import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| 'YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

// Use experimentalForceLongPolling to fix WebchannelConnection failures
// in restricted networks (school Wi-Fi, lab environments, smart boards)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

/**
 * Firestore data model:
 *
 * users/{userId}
 *   - id: string
 *   - name: string
 *   - role: "teacher" | "student"
 *   - school_id: string
 *
 * lessons/{lessonId}
 *   - id: string
 *   - teacher_id: string
 *   - original_text: string
 *   - source_language: string ("hi" | "en")
 *   - grade_level: "1-2" | "3-5" | "6-8"
 *   - created_at: Timestamp
 *
 * translations/{translationId}
 *   - id: string
 *   - lesson_id: string
 *   - target_language: string
 *   - simplified_text: string
 *   - translated_text: string
 *   - audio_url: string (data URI or Storage URL)
 *   - created_at: Timestamp
 */
