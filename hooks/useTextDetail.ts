import { useCognitiveSettings } from "./useCognitiveSettings";

/**
 * useTextDetail Hook - MindEase
 * 
 * Hook for accessing and working with text detail mode (detailed vs summary).
 * 
 * Provides:
 * - Current text detail mode
 * - Helper functions to conditionally render content
 * - Helper to get data attribute for CSS-based show/hide
 * 
 * @example
 * ```tsx
 * // Render different content based on mode
 * function MyComponent() {
 *   const { isSummary, render } = useTextDetail();
 *   
 *   return (
 *     <div>
 *       {render(
 *         <p>This is the detailed version with lots of information...</p>,
 *         <p>Summary version</p>
 *       )}
 *     </div>
 *   );
 * }
 * 
 * // Use CSS data attributes for show/hide
 * function MyComponent() {
 *   const { dataAttribute } = useTextDetail();
 *   
 *   return (
 *     <div>
 *       <p data-text-detail="detailed">Detailed content</p>
 *       <p data-text-detail="summary">Summary content</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTextDetail() {
  const { settings } = useCognitiveSettings();
  const isSummary = settings.textDetail === "summary";
  const isDetailed = settings.textDetail === "detailed";

  /**
   * Conditionally render content based on text detail mode
   * 
   * @param detailed - Content to show in detailed mode
   * @param summary - Content to show in summary mode
   * @returns The appropriate content based on current mode
   */
  function render<T>(detailed: T, summary: T): T {
    return isSummary ? summary : detailed;
  }

  /**
   * Get data attribute value for CSS-based show/hide
   * 
   * @returns "detailed" or "summary" based on current mode
   */
  const dataAttribute = settings.textDetail;

  return {
    mode: settings.textDetail,
    isSummary,
    isDetailed,
    render,
    dataAttribute,
  };
}

