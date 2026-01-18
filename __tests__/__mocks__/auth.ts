/**
 * Auth Mocks - Centralized test fixtures for authentication
 * Reusable mock factories for Session and AuthUser entities
 */

import type { Session } from 'next-auth';
import type { AuthUser } from '@/models/auth';

/**
 * Creates a mock Session with default values
 * @param overrides - Partial Session object to override defaults
 * @returns A complete Session object
 */
export const createSession = (overrides?: Partial<Session>): Session => ({
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
  },
  expires: '2024-12-31',
  ...overrides,
} as Session);

/**
 * Creates a mock AuthUser with default values
 * @param overrides - Partial AuthUser object to override defaults
 * @returns A complete AuthUser object
 */
export const createAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  uid: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  image: 'https://example.com/avatar.jpg',
  ...overrides,
});

/**
 * Common session mock variants for testing
 */
export const sessionMocks = {
  /**
   * A valid session with all fields
   */
  valid: (): Session => createSession(),

  /**
   * A session with null email
   */
  withNullEmail: (): Session =>
    createSession({
      user: {
        id: 'user-123',
        email: '',
        name: 'Test User',
        image: null,
      },
    }),

  /**
   * A session without user
   */
  withoutUser: (): Session =>
    createSession({
      user: undefined,
    }),

  /**
   * A minimal session with only required fields
   */
  minimal: (): Session =>
    createSession({
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    }),
};

/**
 * Common auth user mock variants for testing
 */
export const authUserMocks = {
  /**
   * A valid auth user with all fields
   */
  valid: (): AuthUser => createAuthUser(),

  /**
   * An auth user with null email
   */
  withNullEmail: (): AuthUser =>
    createAuthUser({
      email: null,
      image: null,
    }),

  /**
   * A minimal auth user with only required fields
   */
  minimal: (): AuthUser =>
    createAuthUser({
      email: 'test@example.com',
      name: null,
      image: null,
    }),
};
