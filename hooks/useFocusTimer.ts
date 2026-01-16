/**
 * useFocusTimer Hook - MindEase
 * Simple hook interface for consuming focus timer context
 * 
 * All business logic is handled by the FocusTimerProvider.
 * This hook provides a clean API for components to interact with the timer.
 * 
 * Features:
 * - Single active timer per session (one task at a time)
 * - Timer state persistence across page navigation
 * - Simple state: idle or running (no pause)
 * - Task association only (no subtask tracking)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { timerState, startTimer, stopTimer } = useFocusTimer();
 *   
 *   return (
 *     <div>
 *       <button onClick={() => startTimer("task-123")}>Start</button>
 *       <button onClick={stopTimer}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useFocusTimerContext } from "@/contexts/focus-timer-context";

/**
 * Hook for accessing focus timer state and operations
 * 
 * @returns Timer state, control functions
 * @throws Error if used outside FocusTimerProvider
 */
export function useFocusTimer() {
  const context = useFocusTimerContext();
  return context;
}
