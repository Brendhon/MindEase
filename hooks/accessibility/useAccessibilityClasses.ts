import { useMemo } from 'react';
import { useCognitiveSettingsContext } from '@/contexts/cognitive-settings';
import {
  getAnimationClasses,
  getCombinedAccessibilityClasses,
  getContrastClasses,
  getFocusModeClasses,
  getFontSizeClasses,
  getSpacingClasses,
  getSpacingValue,
} from '@/utils/accessibility';

/**
 * useAccessibilityClasses Hook - MindEase
 *
 * Optimized hook for generating accessibility Tailwind classes.
 *
 * This hook is separated from useCognitiveSettings to:
 * - Reduce unnecessary re-renders (only re-renders when relevant settings change)
 * - Improve performance (components only subscribe to classes they need)
 * - Better separation of concerns (classes generation vs state management)
 *
 * Each class type is memoized independently, so components only re-render
 * when the specific setting they use changes.
 *
 * @example
 * ```tsx
 * // Component only re-renders when spacing changes
 * function MyComponent() {
 *   const { spacingClasses } = useAccessibilityClasses();
 *   return <div className={spacingClasses.padding}>Content</div>;
 * }
 *
 * // Component only re-renders when fontSize changes
 * function TextComponent() {
 *   const { fontSizeClasses } = useAccessibilityClasses();
 *   return <p className={fontSizeClasses.base}>Text</p>;
 * }
 * ```
 *
 * @throws Error if used outside CognitiveSettingsProvider
 */
export function useAccessibilityClasses() {
  const { settings } = useCognitiveSettingsContext();

  // Memoize each class type independently to minimize re-renders
  // Components only re-render when the specific setting they use changes

  const contrastClasses = useMemo(
    () => getContrastClasses(settings.contrast),
    [settings.contrast]
  );

  const spacingClasses = useMemo(
    () => getSpacingClasses(settings.spacing),
    [settings.spacing]
  );

  const spacingValue = useMemo(
    () => getSpacingValue(settings.spacing),
    [settings.spacing]
  );

  const fontSizeClasses = useMemo(
    () => getFontSizeClasses(settings.fontSize),
    [settings.fontSize]
  );

  const animationClasses = useMemo(
    () => getAnimationClasses(settings.animations),
    [settings.animations]
  );

  const focusModeClasses = useMemo(
    () => getFocusModeClasses(settings.focusMode),
    [settings.focusMode]
  );

  return {
    // Pre-computed classes (re-render only when relevant setting changes)
    contrastClasses,
    spacingClasses,
    spacingValue,
    fontSizeClasses,
    animationClasses,
    focusModeClasses,

    // Dynamic class generators (for custom settings)
    getContrastClasses: (contrast = settings.contrast) =>
      getContrastClasses(contrast),
    getSpacingClasses: (spacing = settings.spacing) =>
      getSpacingClasses(spacing),
    getSpacingValue: (spacing = settings.spacing) => getSpacingValue(spacing),
    getFontSizeClasses: (fontSize = settings.fontSize) =>
      getFontSizeClasses(fontSize),
    getAnimationClasses: (animations = settings.animations) =>
      getAnimationClasses(animations),
    getFocusModeClasses: (focusMode = settings.focusMode) =>
      getFocusModeClasses(focusMode),
    getCombinedClasses: (
      context: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' = 'base'
    ) => getCombinedAccessibilityClasses(settings, context),
  };
}
