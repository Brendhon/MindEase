/**
 * Services Mocks - For testing services that depend on other services
 */

import { vi } from 'vitest';

/**
 * Creates mock functions for tasks service
 * @returns Mock object with tasksService methods
 */
export const createMockTasksService = () => ({
  deleteAllTasks: vi.fn(),
});

/**
 * Creates mock functions for user preferences service
 * @returns Mock object with userPreferencesService methods
 */
export const createMockUserPreferencesService = () => ({
  deleteUserPreferences: vi.fn(),
});

/**
 * Default mock implementations for services
 * These are used when vi.mock() is called in test files
 */
export const mockTasksService = {
  deleteAllTasks: vi.fn(),
};

export const mockUserPreferencesService = {
  deleteUserPreferences: vi.fn(),
};
