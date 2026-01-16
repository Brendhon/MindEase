/**
 * useBreakTimer Hook - MindEase
 * Simple hook interface for consuming break timer context
 * 
 * All business logic is handled by the BreakTimerProvider.
 * This hook provides a clean API for components to interact with the break timer.
 * 
 * Features:
 * - Single active break timer per session
 * - Timer state persistence across page navigation
 * - Simple state: idle, running, or breakEnded
 * - Optional task association
 * 
 * @example
 * ```tsx
 * const { breakTimerState, startBreak, stopBreak } = useBreakTimer();
 * 
 * startBreak("task-123");
 * // Break timer starts running...
 * stopBreak();
 * // Break timer stops and resets
 * ```
 */

import { useBreakTimerContext } from "@/contexts/break-timer-context";

/**
 * Re-export types for convenience
 */
export type {
  BreakTimerState,
  BreakTimerStateType,
  BreakTimerContextValue,
} from "@/contexts/break-timer-context";

/**
 * Hook for accessing break timer state and operations
 * 
 * @returns Break timer state, control functions
 * @throws Error if used outside BreakTimerProvider
 */
export function useBreakTimer() {
  const context = useBreakTimerContext();
  return context;
}
