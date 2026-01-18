/**
 * Firestore Service Mock - For testing services that depend on firestoreService
 */

import { vi } from 'vitest';

/**
 * Creates mock functions for firestore service
 * @returns Mock object with all firestoreService methods
 */
export const createMockFirestoreService = () => ({
  getCollection: vi.fn(),
  getCollectionByQuery: vi.fn(),
  getDocument: vi.fn(),
  createDocument: vi.fn(),
  setDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  deleteCollection: vi.fn(),
});

/**
 * Default mock implementation for firestoreService
 * This is used when vi.mock() is called in test files
 */
export const mockFirestoreService = {
  getCollection: vi.fn(),
  getCollectionByQuery: vi.fn(),
  getDocument: vi.fn(),
  createDocument: vi.fn(),
  setDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  deleteCollection: vi.fn(),
};
