import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
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
    // Assign admin role to the primary user for testing/management
    const isAdmin = email.toLowerCase() === 'sergiosilvabezerra@gmail.com';
    const userData = {
      uid,
      name,
      email,
      role: isAdmin ? 'admin' : 'student',
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
    const profile: any = await getUserProfile(user.uid);
    const isAdminEmail = user.email?.toLowerCase() === 'sergiosilvabezerra@gmail.com';
    
    if (!profile) {
      await createUserProfile(user.uid, user.displayName || 'No Name', user.email || '');
    } else if (isAdminEmail && profile.role !== 'admin') {
      // Force admin role for the primary user if it's not set
      await updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
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

export async function signInAsGuest() {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    throw error;
  }
}

// Generic Firestore Helpers
export async function addDocument(collectionName: string, data: any) {
  try {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, {
      ...data,
      id: docRef.id,
      createdAt: Timestamp.now().toDate().toISOString()
    });
    return docRef.id;
  } catch (err) {
    return handleFirestoreError(err, 'create', collectionName);
  }
}

export async function getCollection(collectionName: string, constraints: any[] = []) {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    return handleFirestoreError(err, 'list', collectionName);
  }
}

export async function updateDocument(collectionName: string, id: string, data: any) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now().toDate().toISOString()
    });
  } catch (err) {
    return handleFirestoreError(err, 'update', `${collectionName}/${id}`);
  }
}

// Specialized Actions
export async function createCourse(name: string, modality: string, duration: string) {
  return addDocument('courses', { name, modality, duration, coordinators: [] });
}

export async function createSubject(name: string, courseId: string, tutorName: string) {
  return addDocument('subjects', { name, courseId, tutorName, startDate: Timestamp.now().toDate().toISOString() });
}

export async function publishContent(subjectId: string, title: string, type: 'video' | 'pdf' | 'audio', url: string) {
  return addDocument('contents', { subjectId, title, type, url });
}

export async function createAssessment(subjectId: string, title: string, dueDate: string) {
  return addDocument('assessments', { subjectId, title, dueDate, status: 'Ativo' });
}
