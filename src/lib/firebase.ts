import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInAnonymously 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where,
  getDocFromServer,
  Timestamp
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
// Use default database if firestoreDatabaseId is not provided or is '(default)'
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
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
    console.warn("Firebase Connection Test Result:", error?.code, error?.message);
    
    if (error?.message?.includes('the client is offline')) {
      console.error("Firebase is offline. Please check your network and configuration.");
    } else if (error?.code === 'permission-denied') {
      console.log("Firebase server reached (Permission Denied - this is normal if the document doesn't exist).");
    } else if (error?.code === 'not-found') {
      console.log("Firebase server reached (Document not found).");
    } else {
      console.log("Firebase server reached (but returned an error).");
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

export async function deleteDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    return handleFirestoreError(err, 'delete', `${collectionName}/${id}`);
  }
}

// Specialized Actions
export async function createCourse(name: string, modality: string, duration: string) {
  return addDocument('courses', { name, modality, duration, coordinators: [] });
}

export async function createSubject(name: string, courseId: string, tutorName: string, tutorId: string = '', tutorEmail: string = '', hours: number = 0) {
  return addDocument('subjects', { 
    name, 
    courseId, 
    tutorName, 
    tutorId,
    tutorEmail,
    hours,
    startDate: Timestamp.now().toDate().toISOString() 
  });
}

export async function publishContent(subjectId: string, subjectName: string, title: string, type: 'video' | 'pdf' | 'audio' | 'link' | 'other', url: string, teacherId: string, teacherName: string) {
  return addDocument('contents', { 
    subjectId, 
    subjectName,
    title, 
    type, 
    url, 
    teacherId,
    teacherName,
    status: 'Pendente',
    createdAt: Timestamp.now().toDate().toISOString()
  });
}

export async function createAssessment(data: {
  subjectId: string,
  teacherId: string,
  title: string,
  description?: string,
  type: 'test' | 'assignment',
  questions?: any[],
  dueDate: string,
  totalPoints?: number
}) {
  return addDocument('assessments', { ...data, status: 'Ativa' });
}

export async function getTeachers() {
  return getCollection('users', [where('role', '==', 'teacher')]);
}

export async function getTeacherSubjects(tutorId: string) {
  return getCollection('subjects', [where('tutorId', '==', tutorId)]);
}

export async function updateCourseCurriculum(courseId: string, url: string, text: string) {
  return updateDocument('courses', courseId, { curriculumUrl: url, curriculumText: text });
}

export async function deleteSubject(subjectId: string) {
  try {
    // 1. Delete contents
    const contentsRef = collection(db, 'contents');
    const q1 = query(contentsRef, where('subjectId', '==', subjectId));
    const snap1 = await getDocs(q1);
    await Promise.all(snap1.docs.map(d => deleteDoc(d.ref)));

    // 2. Delete assessments
    const assessmentsRef = collection(db, 'assessments');
    const q2 = query(assessmentsRef, where('subjectId', '==', subjectId));
    const snap2 = await getDocs(q2);
    await Promise.all(snap2.docs.map(d => deleteDoc(d.ref)));

    // 3. Delete subject
    await deleteDoc(doc(db, 'subjects', subjectId));
  } catch (err) {
    return handleFirestoreError(err, 'delete', `subjects/${subjectId}`);
  }
}

export async function deleteCourse(courseId: string) {
  try {
    // 1. Get and delete all subjects associated with this course (calling deleteSubject for deep cleanup)
    const subjectsRef = collection(db, 'subjects');
    const q = query(subjectsRef, where('courseId', '==', courseId));
    const querySnapshot = await getDocs(q);
    
    await Promise.all(querySnapshot.docs.map(d => deleteSubject(d.id)));
    
    // 2. Delete the course itself
    return deleteDocument('courses', courseId);
  } catch (err) {
    return handleFirestoreError(err, 'delete', `courses/${courseId}`);
  }
}
