/**
 * NextAuth Mock - For testing services that depend on next-auth/react
 */

import { vi } from 'vitest';

/**
 * Creates mock functions for next-auth/react module
 * @returns Mock object with signIn, signOut, and getSession functions
 */
export const createMockNextAuth = () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
});

/**
 * Default mock implementation for next-auth/react
 * This is used when vi.mock() is called in test files
 */
export const mockNextAuth = {
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
};
