"use client";

import { createContext, useContext, ReactNode } from "react";
import { useFocusTimer as useFocusTimerHook } from "@/hooks/useFocusTimer";

/**
 * Focus Timer Context - MindEase
 * Global timer management for task-focused Pomodoro sessions
 * 
 * Features:
 * - Single active timer per session (one task at a time)
 * - Timer state persistence across page navigation
 * - Automatic task status updates (todo -> in_progress)
 * - Subtask focus tracking (optional)
 */

export type TimerState = "idle" | "running" | "paused";

export interface FocusTimerState {
  activeTaskId: string | null;
  timerState: TimerState;
  remainingTime: number; // in seconds
  focusedSubtaskId: string | null;
  startTime: Date | null;
}

export interface FocusTimerContextValue {
  timerState: FocusTimerState;
  startTimer: (taskId: string, subtaskId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  switchTask: (taskId: string, subtaskId?: string) => void;
  formatTime: (seconds: number) => string;
}

const FocusTimerContext = createContext<FocusTimerContextValue | undefined>(undefined);

/**
 * Focus Timer Provider Props
 */
export interface FocusTimerProviderProps {
  children: ReactNode;
  onTaskStatusChange?: (taskId: string, status: number) => void;
}

/**
 * Focus Timer Provider Component
 * Wraps children with focus timer context using the useFocusTimer hook
 */
export function FocusTimerProvider({ children, onTaskStatusChange }: FocusTimerProviderProps) {
  const timerValue = useFocusTimerHook(onTaskStatusChange);

  return (
    <FocusTimerContext.Provider value={timerValue}>
      {children}
    </FocusTimerContext.Provider>
  );
}

/**
 * Hook to access focus timer context
 */
export function useFocusTimer(): FocusTimerContextValue {
  const context = useContext(FocusTimerContext);
  if (context === undefined) {
    throw new Error("useFocusTimer must be used within FocusTimerProvider");
  }
  return context;
}
