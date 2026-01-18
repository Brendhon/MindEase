/**
 * Firestore Service Mock - For testing services that depend on Firestore
 */

import { vi } from 'vitest';

export const createMockFirestoreService = () => {
  const mockData: Record<string, any[]> = {};

  return {
    getCollection: vi.fn(<T>(collectionPath: string): Promise<T[]> => {
      return Promise.resolve((mockData[collectionPath] || []) as T[]);
    }),

    getCollectionByQuery: vi.fn(<T>(collectionPath: string): Promise<T[]> => {
      return Promise.resolve((mockData[collectionPath] || []) as T[]);
    }),

    getDocument: vi.fn(<T>(collectionPath: string, id: string): Promise<T | null> => {
      const collection = mockData[collectionPath] || [];
      const doc = collection.find((item: any) => item.id === id);
      return Promise.resolve((doc as T) || null);
    }),

    createDocument: vi.fn(<T extends { id: string }>(
      collectionPath: string,
      data: Omit<T, 'id'>
    ): Promise<T> => {
      if (!mockData[collectionPath]) {
        mockData[collectionPath] = [];
      }
      const newDoc = {
        ...data,
        id: `mock-id-${Date.now()}-${Math.random()}`,
      } as T;
      mockData[collectionPath].push(newDoc);
      return Promise.resolve(newDoc);
    }),

    setDocument: vi.fn(<T extends { id: string }>(
      collectionPath: string,
      id: string,
      data: Omit<T, 'id'>
    ): Promise<T> => {
      if (!mockData[collectionPath]) {
        mockData[collectionPath] = [];
      }
      const existingIndex = mockData[collectionPath].findIndex((item: any) => item.id === id);
      const doc = { ...data, id } as T;
      
      if (existingIndex >= 0) {
        mockData[collectionPath][existingIndex] = doc;
      } else {
        mockData[collectionPath].push(doc);
      }
      return Promise.resolve(doc);
    }),

    updateDocument: vi.fn(<T>(
      collectionPath: string,
      id: string,
      data: Partial<T>
    ): Promise<T> => {
      const collection = mockData[collectionPath] || [];
      const existingIndex = collection.findIndex((item: any) => item.id === id);
      
      if (existingIndex >= 0) {
        const updated = { ...collection[existingIndex], ...data, id } as T;
        collection[existingIndex] = updated;
        return Promise.resolve(updated);
      }
      
      throw new Error(`Document ${id} not found in ${collectionPath}`);
    }),

    deleteDocument: vi.fn((collectionPath: string, id: string): Promise<void> => {
      const collection = mockData[collectionPath] || [];
      const index = collection.findIndex((item: any) => item.id === id);
      if (index >= 0) {
        collection.splice(index, 1);
      }
      return Promise.resolve();
    }),

    deleteCollection: vi.fn((collectionPath: string): Promise<void> => {
      mockData[collectionPath] = [];
      return Promise.resolve();
    }),

    // Helper to reset mock data
    reset: () => {
      Object.keys(mockData).forEach((key) => delete mockData[key]);
    },

    // Helper to set mock data
    setMockData: (collectionPath: string, data: any[]) => {
      mockData[collectionPath] = data;
    },
  };
};
