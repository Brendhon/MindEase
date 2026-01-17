import { createContext, useContext } from "react";

/**
 * Break Timer Context - MindEase
 * Global break timer state management
 * 
 * All business logic is handled by the BreakTimerProvider.
 * Components should use useBreakTimer() hook, not useBreakTimerContext().
 */

export type BreakTimerStateType = "idle" | "running" | "breakEnded";

export interface BreakTimerState {
  activeTaskId: string | null;
  breakTimerState: BreakTimerStateType;
  remainingTime: number; // in seconds
  startTime: Date | null;
}

/**
 * Break timer reducer actions
 */
export type BreakTimerAction =
  | { type: "START"; duration: number; taskId?: string }
  | { type: "STOP"; defaultDuration: number }
  | { type: "TICK"; defaultDuration: number };

/**
 * Break Timer Context Value
 * Contains timer state and control functions
 */
export interface BreakTimerContextValue {
  /** Current break timer state */
  breakTimerState: BreakTimerState;
  /** Start break timer (optionally for a task) */
  startBreak: (taskId?: string) => void;
  /** Stop break timer and reset to idle */
  stopBreak: () => void;
  /** Check if a task is active */
  isActive: (taskId?: string | undefined) => boolean;
  /** Check if a task is running */
  isRunning: (taskId?: string | undefined) => boolean;
  /** Get remaining time for a task */
  remainingTime: number;
  /** Check if a task has an active task */
  hasActiveTask: boolean;
}

export const BreakTimerContext = createContext<BreakTimerContextValue | undefined>(undefined);

/**
 * Hook to access break timer context
 * 
 * ⚠️ **Note**: This hook is for internal use by useBreakTimer hook only.
 * Components should use useBreakTimer() instead.
 * 
 * @throws Error if used outside BreakTimerProvider
 * 
 * @internal
 */
export function useBreakTimerContext(): BreakTimerContextValue {
  const context = useContext(BreakTimerContext);
  if (context === undefined) {
    throw new Error("useBreakTimerContext must be used within BreakTimerProvider");
  }
  return context;
}
