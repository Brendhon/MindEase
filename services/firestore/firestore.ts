/**
 * Firestore Service - MindEase
 * Firestore database service
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";

/**
 * Convert Firestore timestamp to Date
 */
const convertTimestamps = <T>(data: DocumentData): T => {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted as T;
};

/**
 * Remove undefined fields from an object
 * Firestore does not accept undefined values
 */
export const removeUndefinedFields = <T extends Record<string, unknown>>(data: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      cleaned[key as keyof T] = data[key] as T[keyof T];
    }
  });
  return cleaned;
};

/**
 * Firestore Service interface
 */
export interface FirestoreService {
  getCollection: <T>(collectionPath: string) => Promise<T[]>;
  getCollectionByQuery: <T>(collectionPath: string, queryConstraints: QueryConstraint[]) => Promise<T[]>;
  getDocument: <T>(collectionPath: string, id: string) => Promise<T | null>;
  createDocument: <T extends { id: string }>(collectionPath: string, data: Omit<T, "id">) => Promise<T>;
  setDocument: <T extends { id: string }>(collectionPath: string, id: string, data: Omit<T, "id">) => Promise<T>;
  updateDocument: <T>(collectionPath: string, id: string, data: Partial<T>) => Promise<T>;
  deleteDocument: (collectionPath: string, id: string) => Promise<void>;
  deleteCollection: (collectionPath: string) => Promise<void>;
}

/**
 * Firestore Service implementation
 */
export const firestoreService: FirestoreService = {
  /**
   * Get all documents from a collection
   */
  getCollection: async <T>(collectionPath: string): Promise<T[]> => {
    try {
      const collectionRef = collection(db, collectionPath);
      const querySnapshot = await getDocs(collectionRef);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return convertTimestamps<T>({
          id: doc.id,
          ...data,
        });
      });
    } catch (error) {
      console.error(`Error getting collection ${collectionPath}:`, error);
      throw error;
    }
  },

  /**
   * Get documents from a collection with query constraints
   */
  getCollectionByQuery: async <T>(
    collectionPath: string,
    queryConstraints: QueryConstraint[]
  ): Promise<T[]> => {
    try {
      const collectionRef = collection(db, collectionPath);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return convertTimestamps<T>({
          id: doc.id,
          ...data,
        });
      });
    } catch (error) {
      console.error(`Error getting collection by query ${collectionPath}:`, error);
      throw error;
    }
  },

  /**
   * Get a single document by ID
   */
  getDocument: async <T>(collectionPath: string, id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionPath, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      return convertTimestamps<T>({
        id: docSnap.id,
        ...data,
      });
    } catch (error) {
      console.error(`Error getting document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new document in a collection
   */
  createDocument: async <T extends { id: string }>(
    collectionPath: string,
    data: Omit<T, "id">
  ): Promise<T> => {
    try {
      const collectionRef = collection(db, collectionPath);
      // Remove undefined fields before sending to Firestore
      const cleanedData = removeUndefinedFields(data as Record<string, unknown>);
      const docRef = await addDoc(collectionRef, cleanedData);
      
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Failed to create document");
      }
      
      const docData = docSnap.data();
      return convertTimestamps<T>({
        id: docSnap.id,
        ...docData,
      } as T);
    } catch (error) {
      console.error(`Error creating document in ${collectionPath}:`, error);
      throw error;
    }
  },

  /**
   * Set a document (create or update with merge)
   * Uses setDoc with merge: true to create if doesn't exist or update if exists
   */
  setDocument: async <T extends { id: string }>(
    collectionPath: string,
    id: string,
    data: Omit<T, "id">
  ): Promise<T> => {
    try {
      const docRef = doc(db, collectionPath, id);
      // Remove undefined fields before sending to Firestore
      const cleanedData = removeUndefinedFields(data as Record<string, unknown>);
      await setDoc(docRef, cleanedData, { merge: true });
      
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Failed to set document");
      }
      
      const docData = docSnap.data();
      return convertTimestamps<T>({
        id: docSnap.id,
        ...docData,
      } as T);
    } catch (error) {
      console.error(`Error setting document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing document
   */
  updateDocument: async <T>(
    collectionPath: string,
    id: string,
    data: Partial<T>
  ): Promise<T> => {
    try {
      const docRef = doc(db, collectionPath, id);
      // Remove undefined fields before sending to Firestore
      const cleanedData = removeUndefinedFields(data as Record<string, unknown>);
      await updateDoc(docRef, cleanedData as DocumentData);
      
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Document not found after update");
      }
      
      const docData = docSnap.data();
      return convertTimestamps<T>({
        id: docSnap.id,
        ...docData,
      });
    } catch (error) {
      console.error(`Error updating document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a document
   */
  deleteDocument: async (collectionPath: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${collectionPath}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete all documents from a collection using batched writes.
   * Note: Firestore doesn't support deleting collections directly,
   * so we delete all documents in batches for efficiency.
   */
  deleteCollection: async (collectionPath: string): Promise<void> => {
    try {
      const collectionRef = collection(db, collectionPath);
      const querySnapshot = await getDocs(collectionRef);

      const BATCH_SIZE = 500; // Firestore limit
      const docs = querySnapshot.docs;

      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const batchDocs = docs.slice(i, i + BATCH_SIZE);

        batchDocs.forEach((docSnapshot) => {
          batch.delete(docSnapshot.ref);
        });

        await batch.commit();
      }
    } catch (error) {
      console.error(`Error deleting collection ${collectionPath}:`, error);
      throw error;
    }
  },
};

