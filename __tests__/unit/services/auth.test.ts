import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService, convertSession } from '@/services/auth/auth';
import { signIn, signOut, getSession } from 'next-auth/react';
import { tasksService } from '@/services/tasks';
import { userPreferencesService } from '@/services/user-preferences';
import {
  createSession,
  createAuthUser,
  sessionMocks,
  authUserMocks,
} from '@/__tests__/__mocks__/auth';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}));

// Mock other services
vi.mock('@/services/tasks', () => ({
  tasksService: {
    deleteAllTasks: vi.fn(),
  },
}));

vi.mock('@/services/user-preferences', () => ({
  userPreferencesService: {
    deleteUserPreferences: vi.fn(),
  },
}));

// Test constants
const MOCK_USER_ID = 'user-123';
const MOCK_EMAIL = 'test@example.com';
const MOCK_NAME = 'Test User';
const MOCK_IMAGE = 'https://example.com/avatar.jpg';
const MOCK_EXPIRES = '2024-12-31';

// Helper functions for common mock setups
const setupSignInSuccess = () => {
  vi.mocked(signIn).mockResolvedValue(undefined);
};

const setupSignInFailure = (errorMessage: string = 'Sign in failed') => {
  vi.mocked(signIn).mockRejectedValue(new Error(errorMessage));
};

const setupSignOutSuccess = () => {
  vi.mocked(signOut).mockResolvedValue(undefined);
};

const setupSignOutFailure = (errorMessage: string = 'Sign out failed') => {
  vi.mocked(signOut).mockRejectedValue(new Error(errorMessage));
};

const setupGetSessionSuccess = (
  session: ReturnType<typeof createSession> | null
) => {
  vi.mocked(getSession).mockResolvedValue(session);
};

const setupGetSessionFailure = (errorMessage: string = 'Session error') => {
  vi.mocked(getSession).mockRejectedValue(new Error(errorMessage));
};

const setupDeleteAccountSuccess = () => {
  vi.mocked(tasksService.deleteAllTasks).mockResolvedValue(undefined);
  vi.mocked(userPreferencesService.deleteUserPreferences).mockResolvedValue(
    undefined
  );
  vi.mocked(signOut).mockResolvedValue(undefined);
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('convertSession', () => {
    it('should convert valid session to AuthUser', () => {
      const session = createSession({
        user: {
          id: MOCK_USER_ID,
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          image: MOCK_IMAGE,
        },
        expires: MOCK_EXPIRES,
      });

      const result = convertSession(session);

      expect(result).toEqual(
        createAuthUser({
          uid: MOCK_USER_ID,
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          image: MOCK_IMAGE,
        })
      );
    });

    it('should handle session with null email', () => {
      const session = sessionMocks.withNullEmail();

      const result = convertSession(session);

      expect(result).toEqual(authUserMocks.withNullEmail());
    });

    it('should return null when session is null', () => {
      const result = convertSession(null);
      expect(result).toBeNull();
    });

    it('should return null when session has no user', () => {
      const session = sessionMocks.withoutUser();

      const result = convertSession(session);
      expect(result).toBeNull();
    });
  });

  describe('signInWithGoogle', () => {
    it('should call signIn with Google provider', async () => {
      setupSignInSuccess();

      await authService.signInWithGoogle();

      expect(signIn).toHaveBeenCalledWith('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    });

    it('should throw error on sign in failure', async () => {
      const errorMessage = 'Sign in failed';
      setupSignInFailure(errorMessage);

      await expect(authService.signInWithGoogle()).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('signOut', () => {
    it('should call signOut with correct callback URL', async () => {
      setupSignOutSuccess();

      await authService.signOut();

      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: '/login',
        redirect: true,
      });
    });

    it('should throw error on sign out failure', async () => {
      const errorMessage = 'Sign out failed';
      setupSignOutFailure(errorMessage);

      await expect(authService.signOut()).rejects.toThrow(errorMessage);
    });
  });

  describe('getCurrentUser', () => {
    it('should return AuthUser when session exists', async () => {
      const session = createSession({
        user: {
          id: MOCK_USER_ID,
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          image: null,
        },
        expires: MOCK_EXPIRES,
      });

      setupGetSessionSuccess(session);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(
        createAuthUser({
          uid: MOCK_USER_ID,
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          image: null,
        })
      );
    });

    it('should return null when session is null', async () => {
      setupGetSessionSuccess(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      setupGetSessionFailure('Session error');

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const session = sessionMocks.minimal();
      setupGetSessionSuccess(session);

      const result = await authService.getSession();

      expect(result).toEqual(session);
    });

    it('should return null when session is not available', async () => {
      setupGetSessionSuccess(null);

      const result = await authService.getSession();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      setupGetSessionFailure('Session error');

      const result = await authService.getSession();

      expect(result).toBeNull();
    });
  });

  describe('deleteAccount', () => {
    it('should delete all user data and sign out', async () => {
      setupDeleteAccountSuccess();

      await authService.deleteAccount(MOCK_USER_ID);

      expect(tasksService.deleteAllTasks).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(userPreferencesService.deleteUserPreferences).toHaveBeenCalledWith(
        MOCK_USER_ID
      );
      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: '/login',
        redirect: true,
      });
    });

    it('should throw error if tasks deletion fails', async () => {
      const errorMessage = 'Failed to delete tasks';
      vi.mocked(tasksService.deleteAllTasks).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(authService.deleteAccount(MOCK_USER_ID)).rejects.toThrow(
        errorMessage
      );
      expect(
        userPreferencesService.deleteUserPreferences
      ).not.toHaveBeenCalled();
      expect(signOut).not.toHaveBeenCalled();
    });

    it('should throw error if preferences deletion fails', async () => {
      const errorMessage = 'Failed to delete preferences';
      vi.mocked(tasksService.deleteAllTasks).mockResolvedValue(undefined);
      vi.mocked(userPreferencesService.deleteUserPreferences).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(authService.deleteAccount(MOCK_USER_ID)).rejects.toThrow(
        errorMessage
      );
      expect(signOut).not.toHaveBeenCalled();
    });

    it('should throw error if sign out fails', async () => {
      const errorMessage = 'Failed to sign out';
      vi.mocked(tasksService.deleteAllTasks).mockResolvedValue(undefined);
      vi.mocked(userPreferencesService.deleteUserPreferences).mockResolvedValue(
        undefined
      );
      vi.mocked(signOut).mockRejectedValue(new Error(errorMessage));

      await expect(authService.deleteAccount(MOCK_USER_ID)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
