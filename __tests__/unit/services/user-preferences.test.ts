import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userPreferencesService } from '@/services/user-preferences/user-preferences';
import { firestoreService } from '@/services/firestore/firestore';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/models/user-preferences';
import {
  createUserPreferences,
  createUserPreferencesDocument,
  userPreferencesDocumentMocks,
} from '@/__tests__/__mocks__/user-preferences';
import type { UserPreferences, UserPreferencesDocument } from '@/models/user-preferences';

// Mock firestore service
vi.mock('@/services/firestore/firestore', () => ({
  firestoreService: {
    getDocument: vi.fn(),
    setDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

// Test constants
const MOCK_USER_ID = 'user-123';
const MOCK_COLLECTION_PATH = 'users';
const MOCK_FIRESTORE_ERROR = 'Firestore error';

// Helper functions for common mock setups
const setupGetDocumentSuccess = <T>(data: T | null) => {
  vi.mocked(firestoreService.getDocument).mockResolvedValue(data);
};

const setupGetDocumentFailure = (errorMessage: string = MOCK_FIRESTORE_ERROR) => {
  vi.mocked(firestoreService.getDocument).mockRejectedValue(new Error(errorMessage));
};

const setupSetDocumentSuccess = <T extends { id: string }>(data: T) => {
  (vi.mocked(firestoreService.setDocument) as any).mockResolvedValue(data);
};

const setupSetDocumentFailure = (errorMessage: string = MOCK_FIRESTORE_ERROR) => {
  vi.mocked(firestoreService.setDocument).mockRejectedValue(new Error(errorMessage));
};

const setupDeleteDocumentSuccess = () => {
  vi.mocked(firestoreService.deleteDocument).mockResolvedValue(undefined);
};

const setupDeleteDocumentFailure = (errorMessage: string = MOCK_FIRESTORE_ERROR) => {
  vi.mocked(firestoreService.deleteDocument).mockRejectedValue(new Error(errorMessage));
};

describe('userPreferencesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserPreferences', () => {
    it('should return user preferences when they exist', async () => {
      const mockPreferences = createUserPreferencesDocument({
        id: MOCK_USER_ID,
        userId: MOCK_USER_ID,
        contrast: 'high',
        spacing: 'normal',
        fontSize: 'normal',
        animations: true,
        focusMode: true,
        textDetail: 'detailed',
        focusDuration: 30,
        shortBreakDuration: 5,
      });

      setupGetDocumentSuccess(mockPreferences);

      const result = await userPreferencesService.getUserPreferences(MOCK_USER_ID);

      expect(result).toEqual({
        contrast: 'high',
        spacing: 'normal',
        fontSize: 'normal',
        animations: true,
        focusMode: true,
        textDetail: 'detailed',
        focusDuration: 30,
        shortBreakDuration: 5,
      });
      expect(firestoreService.getDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_USER_ID
      );
    });

    it('should return default settings when preferences do not exist', async () => {
      setupGetDocumentSuccess(null);

      const result = await userPreferencesService.getUserPreferences(MOCK_USER_ID);

      expect(result).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
      expect(firestoreService.getDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_USER_ID
      );
    });

    it('should return default settings on error', async () => {
      setupGetDocumentFailure();

      const result = await userPreferencesService.getUserPreferences(MOCK_USER_ID);

      expect(result).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
    });

    it('should only return preferences fields, not metadata', async () => {
      const mockDocument = userPreferencesDocumentMocks.default(MOCK_USER_ID);

      setupGetDocumentSuccess(mockDocument);

      const result = await userPreferencesService.getUserPreferences(MOCK_USER_ID);

      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('updatedAt');
    });
  });

  describe('updateUserPreferences', () => {
    it('should update user preferences', async () => {
      const updates: Partial<UserPreferences> = {
        contrast: 'high',
        fontSize: 'large',
      };

      const currentPreferences = DEFAULT_ACCESSIBILITY_SETTINGS;
      const expectedUpdated = {
        ...currentPreferences,
        ...updates,
      };

      const updatedDocument = createUserPreferencesDocument({
        id: MOCK_USER_ID,
        userId: MOCK_USER_ID,
        ...expectedUpdated,
      });

      setupGetDocumentSuccess(null); // No existing prefs
      setupSetDocumentSuccess(updatedDocument);

      const result = await userPreferencesService.updateUserPreferences(MOCK_USER_ID, updates);

      expect(result).toEqual(expectedUpdated);
      expect(firestoreService.setDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_USER_ID,
        expect.objectContaining({
          ...expectedUpdated,
          userId: MOCK_USER_ID,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should merge with existing preferences', async () => {
      const existingPrefs = createUserPreferencesDocument({
        id: MOCK_USER_ID,
        userId: MOCK_USER_ID,
        contrast: 'normal',
        spacing: 'normal',
        fontSize: 'normal',
        animations: true,
        focusMode: false,
        textDetail: 'detailed',
        focusDuration: 25,
        shortBreakDuration: 5,
      });

      const updates: Partial<UserPreferences> = {
        contrast: 'high',
      };

      const updatedDocument = createUserPreferencesDocument({
        ...existingPrefs,
        contrast: 'high',
      });

      setupGetDocumentSuccess(existingPrefs);
      setupSetDocumentSuccess(updatedDocument);

      const result = await userPreferencesService.updateUserPreferences(MOCK_USER_ID, updates);

      expect(result.contrast).toBe('high');
      expect(result.spacing).toBe('normal'); // Preserved from existing
    });

    it('should throw error on Firestore failure', async () => {
      setupGetDocumentSuccess(null);
      setupSetDocumentFailure();

      await expect(
        userPreferencesService.updateUserPreferences(MOCK_USER_ID, { contrast: 'high' })
      ).rejects.toThrow(MOCK_FIRESTORE_ERROR);
    });
  });

  describe('resetUserPreferences', () => {
    it('should reset preferences to defaults', async () => {
      const resetDocument = createUserPreferencesDocument({
        id: MOCK_USER_ID,
        userId: MOCK_USER_ID,
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
      });

      setupGetDocumentSuccess(null);
      setupSetDocumentSuccess(resetDocument);

      const result = await userPreferencesService.resetUserPreferences(MOCK_USER_ID);

      expect(result).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
      expect(firestoreService.setDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_USER_ID,
        expect.objectContaining({
          ...DEFAULT_ACCESSIBILITY_SETTINGS,
          userId: MOCK_USER_ID,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should throw error on Firestore failure', async () => {
      setupGetDocumentSuccess(null);
      setupSetDocumentFailure();

      await expect(userPreferencesService.resetUserPreferences(MOCK_USER_ID)).rejects.toThrow(
        MOCK_FIRESTORE_ERROR
      );
    });
  });

  describe('deleteUserPreferences', () => {
    it('should delete user preferences document', async () => {
      setupDeleteDocumentSuccess();

      await userPreferencesService.deleteUserPreferences(MOCK_USER_ID);

      expect(firestoreService.deleteDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_USER_ID
      );
    });

    it('should throw error on Firestore failure', async () => {
      setupDeleteDocumentFailure();

      await expect(userPreferencesService.deleteUserPreferences(MOCK_USER_ID)).rejects.toThrow(
        MOCK_FIRESTORE_ERROR
      );
    });
  });
});
