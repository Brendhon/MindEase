import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService, convertSession } from '@/services/auth/auth';
import { signIn, signOut, getSession } from 'next-auth/react';
import { tasksService } from '@/services/tasks';
import { userPreferencesService } from '@/services/user-preferences';
import type { Session } from 'next-auth';
import type { AuthUser } from '@/models/auth';

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

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('convertSession', () => {
    it('should convert valid session to AuthUser', () => {
      const session: Session = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          image: 'https://example.com/avatar.jpg',
        },
        expires: '2024-12-31',
      } as Session;

      const result = convertSession(session);

      expect(result).toEqual({
        uid: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
      });
    });

    it('should handle session with null email', () => {
      const session: Session = {
        user: {
          id: 'user-123',
          email: '',
          name: 'Test User',
          image: null,
        },
        expires: '2024-12-31',
      } as Session;

      const result = convertSession(session);

      expect(result).toEqual({
        uid: 'user-123',
        email: null,
        name: 'Test User',
        image: null,
      });
    });

    it('should return null when session is null', () => {
      const result = convertSession(null);
      expect(result).toBeNull();
    });

    it('should return null when session has no user', () => {
      const session = {
        expires: '2024-12-31',
      } as Session;

      const result = convertSession(session);
      expect(result).toBeNull();
    });
  });

  describe('signInWithGoogle', () => {
    it('should call signIn with Google provider', async () => {
      vi.mocked(signIn).mockResolvedValue(undefined);

      await authService.signInWithGoogle();

      expect(signIn).toHaveBeenCalledWith('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    });

    it('should throw error on sign in failure', async () => {
      const error = new Error('Sign in failed');
      vi.mocked(signIn).mockRejectedValue(error);

      await expect(authService.signInWithGoogle()).rejects.toThrow('Sign in failed');
    });
  });

  describe('signOut', () => {
    it('should call signOut with correct callback URL', async () => {
      vi.mocked(signOut).mockResolvedValue(undefined);

      await authService.signOut();

      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: '/login',
        redirect: true,
      });
    });

    it('should throw error on sign out failure', async () => {
      const error = new Error('Sign out failed');
      vi.mocked(signOut).mockRejectedValue(error);

      await expect(authService.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return AuthUser when session exists', async () => {
      const session: Session = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        expires: '2024-12-31',
      } as Session;

      vi.mocked(getSession).mockResolvedValue(session);

      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        uid: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
      });
    });

    it('should return null when session is null', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      vi.mocked(getSession).mockRejectedValue(new Error('Session error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const session: Session = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
        expires: '2024-12-31',
      } as Session;

      vi.mocked(getSession).mockResolvedValue(session);

      const result = await authService.getSession();

      expect(result).toEqual(session);
    });

    it('should return null when session is not available', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await authService.getSession();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      vi.mocked(getSession).mockRejectedValue(new Error('Session error'));

      const result = await authService.getSession();

      expect(result).toBeNull();
    });
  });

  describe('deleteAccount', () => {
    it('should delete all user data and sign out', async () => {
      const userId = 'user-123';

      vi.mocked(tasksService.deleteAllTasks).mockResolvedValue(undefined);
      vi.mocked(userPreferencesService.deleteUserPreferences).mockResolvedValue(undefined);
      vi.mocked(signOut).mockResolvedValue(undefined);

      await authService.deleteAccount(userId);

      expect(tasksService.deleteAllTasks).toHaveBeenCalledWith(userId);
      expect(userPreferencesService.deleteUserPreferences).toHaveBeenCalledWith(userId);
      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: '/login',
        redirect: true,
      });
    });

    it('should throw error if tasks deletion fails', async () => {
      const userId = 'user-123';
      const error = new Error('Failed to delete tasks');

      vi.mocked(tasksService.deleteAllTasks).mockRejectedValue(error);

      await expect(authService.deleteAccount(userId)).rejects.toThrow('Failed to delete tasks');
      expect(userPreferencesService.deleteUserPreferences).not.toHaveBeenCalled();
      expect(signOut).not.toHaveBeenCalled();
    });

    it('should throw error if preferences deletion fails', async () => {
      const userId = 'user-123';
      const error = new Error('Failed to delete preferences');

      vi.mocked(tasksService.deleteAllTasks).mockResolvedValue(undefined);
      vi.mocked(userPreferencesService.deleteUserPreferences).mockRejectedValue(error);

      await expect(authService.deleteAccount(userId)).rejects.toThrow(
        'Failed to delete preferences'
      );
      expect(signOut).not.toHaveBeenCalled();
    });

    it('should throw error if sign out fails', async () => {
      const userId = 'user-123';
      const error = new Error('Failed to sign out');

      vi.mocked(tasksService.deleteAllTasks).mockResolvedValue(undefined);
      vi.mocked(userPreferencesService.deleteUserPreferences).mockResolvedValue(undefined);
      vi.mocked(signOut).mockRejectedValue(error);

      await expect(authService.deleteAccount(userId)).rejects.toThrow('Failed to sign out');
    });
  });
});
