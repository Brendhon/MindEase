import { Task } from "./task";

export type TimerType = "focus" | "break";

export interface ActiveTimer {
  type: TimerType;
  taskId: string | null;
  time: number;
}

export interface UseActiveTaskIndicatorReturn {
  /** Active timer object with type, taskId, and remaining time, or null */
  activeTimer: ActiveTimer | null;
  /** Active task object or null */
  activeTask: Task | null;
  /** Timer type: "focus" | "break" | null */
  timerType: TimerType | null;
  /** Remaining time in seconds */
  remainingTime: number;
}

/**
 * Timer State Types
 */
export type BreakTimerStateType = "idle" | "running" | "breakEnded";
export type FocusTimerStateType = "idle" | "running";

/**
 * Timer State Interfaces
 */
export interface BreakTimerState {
  activeTaskId: string | null;
  breakTimerState: BreakTimerStateType;
  remainingTime: number; // in seconds
  startTime: Date | null;
}

export interface FocusTimerState {
  activeTaskId: string | null;
  timerState: FocusTimerStateType;
  remainingTime: number; // in seconds
  startTime: Date | null;
}

/**
 * Timer Reducer Actions
 */
export type BreakTimerAction =
  | { type: "START"; duration: number; taskId?: string }
  | { type: "STOP"; defaultDuration: number }
  | { type: "TICK"; defaultDuration: number };

export type FocusTimerAction =
  | { type: "START"; taskId: string; duration: number }
  | { type: "STOP"; defaultDuration: number }
  | { type: "TICK"; defaultDuration: number };

/**
 * Base Timer Context Value
 * Common interface for all timer contexts
 */
export interface BaseTimerContextValue {
  /** Check if a task is active */
  isActive: (taskId?: string | undefined) => boolean;
  /** Check if a task is running */
  isRunning: (taskId?: string | undefined) => boolean;
  /** Get remaining time for a task */
  remainingTime: number;
  /** Check if a task has an active task */
  hasActiveTask: boolean;
}

/**
 * Break Timer Context Value
 * Contains timer state and control functions
 */
export interface BreakTimerContextValue extends BaseTimerContextValue {
  /** Current break timer state */
  breakTimerState: BreakTimerState;
  /** Start break timer (optionally for a task) */
  startBreak: (taskId?: string) => void;
  /** Stop break timer and reset to idle */
  stopBreak: () => void;
}

/**
 * Focus Timer Context Value
 * Contains timer state and control functions
 */
export interface FocusTimerContextValue extends BaseTimerContextValue {
  /** Current timer state */
  timerState: FocusTimerState;
  /** Start timer for a task */
  startTimer: (taskId: string) => void;
  /** Stop timer and reset to idle */
  stopTimer: () => void;
}
