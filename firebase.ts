// Firebase initialization for ArenaQuest
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, update } from "firebase/database";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  updateProfile,
  type User 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKdQhoWM7krQQFRdKd_BKsAm0gCEVEszY",
  authDomain: "roomtracker-8855b.firebaseapp.com",
  databaseURL: "https://roomtracker-8855b-default-rtdb.firebaseio.com",
  projectId: "roomtracker-8855b",
  storageBucket: "roomtracker-8855b.firebasestorage.app",
  messagingSenderId: "140446970291",
  appId: "1:140446970291:web:268e52c44a623ea8c3dbc6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Realtime Database instance
export const database = getDatabase(app);

// Firebase Auth instance
export const auth = getAuth(app);

// Helper functions (thin wrappers over the modular API)
export function dbRef(path: string) {
  return ref(database, path);
}

export async function dbSet(path: string, value: unknown) {
  return set(dbRef(path), value);
}

export function dbOnValue(path: string, callback: (val: any) => void) {
  return onValue(dbRef(path), (snapshot) => {
    callback(snapshot.val());
  });
}

export function dbPush(path: string, value: unknown) {
  return push(dbRef(path), value);
}

export function dbUpdate(path: string, value: Record<string, unknown>) {
  return update(dbRef(path), value);
}

// Auth helper functions
export async function signInAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpAdmin(email: string, password: string, displayName?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  
  return userCredential;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getAdminClaim(user: User): Promise<boolean> {
  const idTokenResult = await user.getIdTokenResult();
  return !!idTokenResult.claims.admin;
}

export default app;
