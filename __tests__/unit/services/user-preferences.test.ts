import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userPreferencesService } from '@/services/user-preferences/user-preferences';
import { firestoreService } from '@/services/firestore/firestore';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/models/user-preferences';
import type { UserPreferences, UserPreferencesDocument } from '@/models/user-preferences';

// Mock firestore service
vi.mock('@/services/firestore/firestore', () => ({
  firestoreService: {
    getDocument: vi.fn(),
    setDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

describe('userPreferencesService', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserPreferences', () => {
    it('should return user preferences when they exist', async () => {
      const mockPreferences: UserPreferencesDocument = {
        id: mockUserId,
        userId: mockUserId,
        contrast: 'high',
        spacing: 'normal',
        fontSize: 'normal',
        animations: true,
        focusMode: true,
        textDetail: 'detailed',
        focusDuration: 30,
        shortBreakDuration: 5,
        updatedAt: new Date(),
      };

      vi.mocked(firestoreService.getDocument).mockResolvedValue(mockPreferences);

      const result = await userPreferencesService.getUserPreferences(mockUserId);

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
      expect(firestoreService.getDocument).toHaveBeenCalledWith('users', mockUserId);
    });

    it('should return default settings when preferences do not exist', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);

      const result = await userPreferencesService.getUserPreferences(mockUserId);

      expect(result).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
    });

    it('should return default settings on error', async () => {
      vi.mocked(firestoreService.getDocument).mockRejectedValue(new Error('Firestore error'));

      const result = await userPreferencesService.getUserPreferences(mockUserId);

      expect(result).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
    });

    it('should only return preferences fields, not metadata', async () => {
      const mockDocument: UserPreferencesDocument = {
        id: mockUserId,
        userId: mockUserId,
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        updatedAt: new Date(),
      };

      vi.mocked(firestoreService.getDocument).mockResolvedValue(mockDocument);

      const result = await userPreferencesService.getUserPreferences(mockUserId);

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

      vi.mocked(firestoreService.getDocument).mockResolvedValue(null); // No existing prefs
      vi.mocked(firestoreService.setDocument).mockResolvedValue({
        id: mockUserId,
        userId: mockUserId,
        ...expectedUpdated,
        updatedAt: new Date(),
      } as UserPreferencesDocument);

      const result = await userPreferencesService.updateUserPreferences(mockUserId, updates);

      expect(result).toEqual(expectedUpdated);
      expect(firestoreService.setDocument).toHaveBeenCalledWith(
        'users',
        mockUserId,
        expect.objectContaining({
          ...expectedUpdated,
          userId: mockUserId,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should merge with existing preferences', async () => {
      const existingPrefs: UserPreferencesDocument = {
        id: mockUserId,
        userId: mockUserId,
        contrast: 'normal',
        spacing: 'normal',
        fontSize: 'normal',
        animations: true,
        focusMode: false,
        textDetail: 'detailed',
        focusDuration: 25,
        shortBreakDuration: 5,
        updatedAt: new Date(),
      };

      const updates: Partial<UserPreferences> = {
        contrast: 'high',
      };

      vi.mocked(firestoreService.getDocument).mockResolvedValue(existingPrefs);
      vi.mocked(firestoreService.setDocument).mockResolvedValue({
        ...existingPrefs,
        contrast: 'high',
        updatedAt: new Date(),
      } as UserPreferencesDocument);

      const result = await userPreferencesService.updateUserPreferences(mockUserId, updates);

      expect(result.contrast).toBe('high');
      expect(result.spacing).toBe('normal'); // Preserved from existing
    });

    it('should throw error on Firestore failure', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);
      vi.mocked(firestoreService.setDocument).mockRejectedValue(new Error('Firestore error'));

      await expect(
        userPreferencesService.updateUserPreferences(mockUserId, { contrast: 'high' })
      ).rejects.toThrow('Firestore error');
    });
  });

  describe('resetUserPreferences', () => {
    it('should reset preferences to defaults', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);
      vi.mocked(firestoreService.setDocument).mockResolvedValue({
        id: mockUserId,
        userId: mockUserId,
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        updatedAt: new Date(),
      } as UserPreferencesDocument);

      const result = await userPreferencesService.resetUserPreferences(mockUserId);

      expect(result).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
      expect(firestoreService.setDocument).toHaveBeenCalledWith(
        'users',
        mockUserId,
        expect.objectContaining({
          ...DEFAULT_ACCESSIBILITY_SETTINGS,
          userId: mockUserId,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should throw error on Firestore failure', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);
      vi.mocked(firestoreService.setDocument).mockRejectedValue(new Error('Firestore error'));

      await expect(userPreferencesService.resetUserPreferences(mockUserId)).rejects.toThrow(
        'Firestore error'
      );
    });
  });

  describe('deleteUserPreferences', () => {
    it('should delete user preferences document', async () => {
      vi.mocked(firestoreService.deleteDocument).mockResolvedValue(undefined);

      await userPreferencesService.deleteUserPreferences(mockUserId);

      expect(firestoreService.deleteDocument).toHaveBeenCalledWith('users', mockUserId);
    });

    it('should throw error on Firestore failure', async () => {
      vi.mocked(firestoreService.deleteDocument).mockRejectedValue(new Error('Firestore error'));

      await expect(userPreferencesService.deleteUserPreferences(mockUserId)).rejects.toThrow(
        'Firestore error'
      );
    });
  });
});
