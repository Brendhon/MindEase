/**
 * Hooks Mocks - Centralized test fixtures for hooks
 * Reusable mock values for accessibility and cognitive settings hooks
 */

import { vi } from 'vitest';

/**
 * Default spacing classes for accessibility mocks
 */
export const defaultSpacingClasses = {
  padding: 'p-4',
  gap: 'gap-2',
  margin: 'm-4',
};

/**
 * Default font size classes for accessibility mocks
 */
export const defaultFontSizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

/**
 * Default accessibility classes for useAccessibilityClasses mock
 */
export const defaultAccessibilityClasses = {
  spacingClasses: defaultSpacingClasses,
  fontSizeClasses: defaultFontSizeClasses,
  contrastClasses: 'contrast-normal',
  animationClasses: 'animate-normal',
};

/**
 * Default cognitive settings for useCognitiveSettings and useCognitiveSettingsContext mocks
 */
export const defaultCognitiveSettings = {
  fontSize: 'base',
  contrast: 'normal',
  spacing: 'normal',
  animations: 'normal',
  complexity: 'normal',
  focusMode: false,
  textDetail: 'normal',
};

/**
 * Creates a mock useAccessibilityClasses return value
 * @param overrides - Partial accessibility classes to override defaults
 * @returns A complete accessibility classes object
 */
export const createAccessibilityClasses = (
  overrides?: Partial<typeof defaultAccessibilityClasses>
) => ({
  ...defaultAccessibilityClasses,
  ...overrides,
});

/**
 * Creates a mock useTextDetail return value
 * @param translations - Optional translations object for getText function
 * @returns A complete useTextDetail return object
 */
export const createTextDetail = (translations?: Record<string, string>) => ({
  getText: (key: string) => translations?.[key] || key,
});

/**
 * Creates a mock useCognitiveSettings return value
 * @param overrides - Partial settings to override defaults
 * @returns A complete useCognitiveSettings return object
 */
export const createCognitiveSettings = (
  overrides?: Partial<typeof defaultCognitiveSettings>
) => ({
  settings: {
    ...defaultCognitiveSettings,
    ...overrides,
  },
  updateSettings: vi.fn(),
});

/**
 * Creates a mock useCognitiveSettingsContext return value
 * @param overrides - Partial settings to override defaults
 * @returns A complete useCognitiveSettingsContext return object
 */
export const createCognitiveSettingsContext = (
  overrides?: Partial<typeof defaultCognitiveSettings>
) => ({
  settings: {
    ...defaultCognitiveSettings,
    ...overrides,
  },
});

/**
 * Common accessibility mocks for testing
 */
export const accessibilityMocks = {
  /**
   * Default accessibility classes mock
   */
  default: () => createAccessibilityClasses(),

  /**
   * Accessibility classes with custom spacing
   */
  withCustomSpacing: (spacing: typeof defaultSpacingClasses) =>
    createAccessibilityClasses({
      spacingClasses: spacing,
    }),

  /**
   * Accessibility classes with custom font sizes
   */
  withCustomFontSizes: (fontSizes: typeof defaultFontSizeClasses) =>
    createAccessibilityClasses({
      fontSizeClasses: fontSizes,
    }),
};

/**
 * Common text detail mocks for testing
 */
export const textDetailMocks = {
  /**
   * Default text detail mock (returns key as value)
   */
  default: () => createTextDetail(),

  /**
   * Text detail mock with custom translations
   */
  withTranslations: (translations: Record<string, string>) =>
    createTextDetail(translations),
};

/**
 * Common cognitive settings mocks for testing
 */
export const cognitiveSettingsMocks = {
  /**
   * Default cognitive settings mock
   */
  default: () => createCognitiveSettings(),

  /**
   * Cognitive settings with focus mode enabled
   */
  withFocusMode: () =>
    createCognitiveSettings({
      focusMode: true,
    }),

  /**
   * Cognitive settings with custom font size
   */
  withFontSize: (fontSize: typeof defaultCognitiveSettings.fontSize) =>
    createCognitiveSettings({
      fontSize,
    }),
};

/**
 * Common cognitive settings context mocks for testing
 */
export const cognitiveSettingsContextMocks = {
  /**
   * Default cognitive settings context mock
   */
  default: () => createCognitiveSettingsContext(),

  /**
   * Cognitive settings context with focus mode enabled
   */
  withFocusMode: () =>
    createCognitiveSettingsContext({
      focusMode: true,
    }),

  /**
   * Cognitive settings context with custom font size
   */
  withFontSize: (fontSize: typeof defaultCognitiveSettings.fontSize) =>
    createCognitiveSettingsContext({
      fontSize,
    }),
};
