import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where,
  getDocFromServer,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

/**
 * Handle Firestore errors by providing structured information.
 */
export const handleFirestoreError = (error: any, operationType: string, path: string | null = null) => {
  if (error?.code === 'permission-denied') {
    const errorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || 'N/A',
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || false,
        providerInfo: auth.currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    console.error('Firestore Permission Denied:', JSON.stringify(errorInfo, null, 2));
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};

/**
 * Test Connection helper as per guidelines
 */
export async function testConnection() {
  try {
    // Attempting to read a non-existent document in a safe way to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase connection established successfully.");
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error("Firebase is offline. Please check your network and configuration.");
    } else {
      // It's normal if it fails with permission denied if the doc doesn't exist 
      // but it still confirms we reached the server.
      console.log("Firebase server reached.");
    }
  }
}

// User Profile Actions
export async function getUserProfile(uid: string) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    return handleFirestoreError(err, 'get', `users/${uid}`);
  }
}

export async function createUserProfile(uid: string, name: string, email: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const userData = {
      uid,
      name,
      email,
      role: 'student', // Default role
      createdAt: Timestamp.now().toDate().toISOString()
    };
    await setDoc(userRef, userData);
    return userData;
  } catch (err) {
    return handleFirestoreError(err, 'create', `users/${uid}`);
  }
}

// Authentication Helpers
export async function signIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists, if not create it
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, user.displayName || 'No Name', user.email || '');
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function logOut() {
  await signOut(auth);
}
