/**
 * User Preferences Mocks - Centralized test fixtures for user preferences
 * Reusable mock factories for UserPreferences and UserPreferencesDocument entities
 */

import type {
  UserPreferences,
  UserPreferencesDocument,
} from '@/models/user-preferences';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/models/user-preferences';

/**
 * Creates a mock UserPreferences with default values
 * @param overrides - Partial UserPreferences object to override defaults
 * @returns A complete UserPreferences object
 */
export const createUserPreferences = (
  overrides?: Partial<UserPreferences>
): UserPreferences => ({
  ...DEFAULT_ACCESSIBILITY_SETTINGS,
  ...overrides,
});

/**
 * Creates a mock UserPreferencesDocument with default values
 * @param overrides - Partial UserPreferencesDocument object to override defaults
 * @returns A complete UserPreferencesDocument object
 */
export const createUserPreferencesDocument = (
  overrides?: Partial<UserPreferencesDocument>
): UserPreferencesDocument => ({
  id: 'user-123',
  userId: 'user-123',
  ...DEFAULT_ACCESSIBILITY_SETTINGS,
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Common user preferences mock variants for testing
 */
export const userPreferencesMocks = {
  /**
   * Default preferences with all default values
   */
  default: (): UserPreferences => createUserPreferences(),

  /**
   * High contrast preferences
   */
  highContrast: (): UserPreferences =>
    createUserPreferences({
      contrast: 'high',
    }),

  /**
   * Large font size preferences
   */
  largeFont: (): UserPreferences =>
    createUserPreferences({
      fontSize: 'large',
    }),

  /**
   * Compact spacing preferences
   */
  compactSpacing: (): UserPreferences =>
    createUserPreferences({
      spacing: 'compact',
    }),

  /**
   * Focus mode enabled preferences
   */
  withFocusMode: (): UserPreferences =>
    createUserPreferences({
      focusMode: true,
    }),

  /**
   * Custom timer durations
   */
  withCustomTimers: (): UserPreferences =>
    createUserPreferences({
      focusDuration: 30,
      shortBreakDuration: 5,
      longBreakDuration: 15,
    }),

  /**
   * Minimal preferences with only required fields
   */
  minimal: (): UserPreferences =>
    createUserPreferences({
      contrast: 'normal',
      spacing: 'normal',
      fontSize: 'normal',
      animations: true,
      focusMode: false,
      textDetail: 'detailed',
    }),
};

/**
 * Common user preferences document mock variants for testing
 */
export const userPreferencesDocumentMocks = {
  /**
   * Default document with all default values
   */
  default: (userId: string = 'user-123'): UserPreferencesDocument =>
    createUserPreferencesDocument({
      id: userId,
      userId,
    }),

  /**
   * High contrast document
   */
  highContrast: (userId: string = 'user-123'): UserPreferencesDocument =>
    createUserPreferencesDocument({
      id: userId,
      userId,
      contrast: 'high',
    }),

  /**
   * Document with custom settings
   */
  custom: (userId: string = 'user-123'): UserPreferencesDocument =>
    createUserPreferencesDocument({
      id: userId,
      userId,
      contrast: 'high',
      fontSize: 'large',
      spacing: 'compact',
      focusMode: true,
      focusDuration: 30,
      shortBreakDuration: 5,
    }),
};
