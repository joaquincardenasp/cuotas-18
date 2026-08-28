import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  Firestore,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  Auth 
} from 'firebase/auth';
import { TripData } from '../types';

// Load config exclusively from environment variables (.env / Vercel Env Variables)
export function getFirebaseEnvConfig(): FirebaseOptions | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (apiKey && projectId) {
    return {
      apiKey,
      projectId,
      appId: appId || undefined,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
    };
  }

  return null;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseInstances() {
  if (app && db && auth) {
    return { app, db, auth };
  }

  const config = getFirebaseEnvConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, auth: null };
  }

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    return { app, db, auth };
  } catch (err) {
    console.error('Error initializing Firebase:', err);
    return { app: null, db: null, auth: null };
  }
}

export function isFirebaseReady(): boolean {
  const { app, db } = getFirebaseInstances();
  return Boolean(app && db);
}

// Google OAuth Login
export async function loginWithGoogle(): Promise<User | null> {
  const { auth } = getFirebaseInstances();
  if (!auth) {
    throw new Error('Firebase no está configurado en las variables de entorno (.env o Vercel).');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  const { auth } = getFirebaseInstances();
  if (auth) {
    await signOut(auth);
  }
}

export function subscribeAuth(callback: (user: User | null) => void) {
  const { auth } = getFirebaseInstances();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Realtime Firestore trip sync
export function subscribeToTrip(
  tripId: string, 
  onUpdate: (data: TripData) => void,
  onError?: (err: Error) => void
) {
  const { db } = getFirebaseInstances();
  if (!db) {
    return () => {};
  }

  const docRef = doc(db, 'trips', tripId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as TripData;
        onUpdate(data);
      }
    },
    (err) => {
      console.warn('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// Save trip to Firestore
export async function syncTripToCloud(tripData: TripData): Promise<void> {
  const { db } = getFirebaseInstances();
  if (!db) return;

  const docRef = doc(db, 'trips', tripData.id);
  await setDoc(docRef, {
    ...tripData,
    updatedAt: Date.now(),
    lastServerUpdate: serverTimestamp(),
  }, { merge: true });
}
