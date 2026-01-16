import { createContext, useContext } from "react";

/**
 * Focus Timer Context - MindEase
 * Global timer state management
 * 
 * All business logic is handled by the FocusTimerProvider.
 * Components should use useFocusTimer() hook, not useFocusTimerContext().
 */

export type TimerState = "idle" | "running";

export interface FocusTimerState {
  activeTaskId: string | null;
  timerState: TimerState;
  remainingTime: number; // in seconds
  startTime: Date | null;
}

/**
 * Timer reducer actions
 */
export type TimerAction =
  | { type: "START"; taskId: string; duration: number }
  | { type: "STOP"; defaultDuration: number }
  | { type: "TICK"; defaultDuration: number }
  | { type: "RESTORE"; state: FocusTimerState };

/**
 * Focus Timer Context Value
 * Contains timer state and control functions
 */
export interface FocusTimerContextValue {
  /** Current timer state */
  timerState: FocusTimerState;
  /** Start timer for a task */
  startTimer: (taskId: string) => void;
  /** Stop timer and reset to idle */
  stopTimer: () => void;
}

export const FocusTimerContext = createContext<FocusTimerContextValue | undefined>(undefined);

/**
 * Hook to access focus timer context
 * 
 * ⚠️ **Note**: This hook is for internal use by useFocusTimer hook only.
 * Components should use useFocusTimer() instead.
 * 
 * @throws Error if used outside FocusTimerProvider
 * 
 * @internal
 */
export function useFocusTimerContext(): FocusTimerContextValue {
  const context = useContext(FocusTimerContext);
  if (context === undefined) {
    throw new Error("useFocusTimerContext must be used within FocusTimerProvider");
  }
  return context;
}
