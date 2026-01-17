import { useCognitiveAlertsContext } from "@/contexts/cognitive-alerts-context";

/**
 * useCognitiveAlerts Hook - MindEase
 * 
 * Hook to access cognitive alerts context and state.
 * 
 * This hook provides:
 * - Alert state (history, timestamps, counters)
 * - Actions to manage alerts (show, dismiss, track focus, etc.)
 * - Helper functions (shouldShowAlert, getTaskFocusTime, etc.)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldShowAlert, showAlert, getTaskFocusTime } = useCognitiveAlerts();
 *   
 *   const handleCheckAlert = () => {
 *     if (shouldShowAlert("excessive_time")) {
 *       showAlert("excessive_time");
 *     }
 *   };
 *   
 *   return <button onClick={handleCheckAlert}>Check Alert</button>;
 * }
 * ```
 * 
 * @throws Error if used outside CognitiveAlertsProvider
 */
export function useCognitiveAlerts() {
  return useCognitiveAlertsContext();
}
