import {
  getAccessibilityText,
  type AccessibilityTextKey,
} from '@/utils/accessibility';
import { ReactNode, useCallback, useMemo } from 'react';
import { useCognitiveSettings } from '@/hooks/cognitive-settings';

/**
 * useTextDetail Hook - MindEase
 *
 * Optimized hook for text detail helpers (detailed/summary modes).
 *
 * This hook is separated from useCognitiveSettings to:
 * - Reduce unnecessary re-renders (only re-renders when textDetail setting changes)
 * - Improve performance (components only subscribe to text detail they need)
 * - Better separation of concerns (text detail vs state management)
 *
 * @example
 * ```tsx
 * // Component only re-renders when textDetail changes
 * function MyComponent() {
 *   const { getText, isDetailed } = useTextDetail();
 *   return <p>{getText("welcome")}</p>;
 * }
 *
 * // Using render helper
 * function ConditionalComponent() {
 *   const { render } = useTextDetail();
 *   return (
 *     <div>
 *       {render(
 *         <DetailedContent />,
 *         <SummaryContent />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @throws Error if used outside CognitiveSettingsProvider
 */
export function useTextDetail() {
  const { settings } = useCognitiveSettings();

  // Memoize text detail values to minimize re-renders
  const mode = useMemo(() => settings.textDetail, [settings.textDetail]);
  const isDetailed = useMemo(
    () => settings.textDetail === 'detailed',
    [settings.textDetail]
  );
  const isSummary = useMemo(
    () => settings.textDetail === 'summary',
    [settings.textDetail]
  );

  // Memoize getTextWithReplace to minimize re-renders
  const getTextWithReplace = useCallback(
    (key: AccessibilityTextKey, replace: Record<string, string>) => {
      const text = getAccessibilityText(key, settings.textDetail);
      return Object.entries(replace).reduce(
        (acc, [key, value]) => acc.replace(`{${key}}`, value),
        text
      );
    },
    [settings.textDetail]
  );

  // Memoize getText to minimize re-renders
  const getText = useCallback(
    (key: AccessibilityTextKey) =>
      getAccessibilityText(key, settings.textDetail),
    [settings.textDetail]
  );

  // Memoize render to minimize re-renders
  const render = useCallback(
    (detailed: ReactNode, summary: ReactNode) => {
      return settings.textDetail === 'summary' ? summary : detailed;
    },
    [settings.textDetail]
  );

  // Return text detail values and helpers
  return {
    mode,
    isDetailed,
    isSummary,
    getText,
    getTextWithReplace,
    render,
  };
}
