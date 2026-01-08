"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

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
 */
export function FocusTimerProvider({ children, onTaskStatusChange }: FocusTimerProviderProps) {
  const { settings } = useCognitiveSettings();
  const [timerState, setTimerState] = useState<FocusTimerState>({
    activeTaskId: null,
    timerState: "idle",
    remainingTime: (settings.focusDuration || 25) * 60, // Convert minutes to seconds
    focusedSubtaskId: null,
    startTime: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const savedStateRef = useRef<FocusTimerState | null>(null);

  // Load saved timer state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mindEase_focusTimer");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore timer state if it was running
        if (parsed.timerState === "running" && parsed.startTime) {
          const startTime = new Date(parsed.startTime);
          const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
          const remaining = Math.max(0, parsed.remainingTime - elapsed);
          
          if (remaining > 0) {
            setTimerState({
              ...parsed,
              remainingTime: remaining,
              startTime,
            });
          } else {
            // Timer completed while away
            setTimerState({
              activeTaskId: null,
              timerState: "idle",
              remainingTime: (settings.focusDuration || 25) * 60,
              focusedSubtaskId: null,
              startTime: null,
            });
            localStorage.removeItem("mindEase_focusTimer");
          }
        } else {
          setTimerState(parsed);
        }
      } catch (err) {
        console.error("Error loading timer state:", err);
      }
    }
  }, []);

  // Save timer state to localStorage
  useEffect(() => {
    if (timerState.timerState !== "idle") {
      localStorage.setItem("mindEase_focusTimer", JSON.stringify(timerState));
    } else {
      localStorage.removeItem("mindEase_focusTimer");
    }
  }, [timerState]);

  // Timer countdown logic
  useEffect(() => {
    if (timerState.timerState !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        if (prev.remainingTime <= 1) {
          // Timer completed
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Notify completion
          if (prev.activeTaskId && onTaskStatusChange) {
            // Don't auto-change status, let user decide
          }

          return {
            ...prev,
            timerState: "idle",
            remainingTime: (settings.focusDuration || 25) * 60,
            startTime: null,
          };
        }

        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.timerState, settings.focusDuration]);

  const startTimer = useCallback((taskId: string, subtaskId?: string) => {
    const focusDuration = (settings.focusDuration || 25) * 60;
    
    setTimerState({
      activeTaskId: taskId,
      timerState: "running",
      remainingTime: focusDuration,
      focusedSubtaskId: subtaskId || null,
      startTime: new Date(),
    });
  }, [settings.focusDuration]);

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      timerState: "paused",
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      timerState: "running",
      startTime: new Date(),
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState({
      activeTaskId: null,
      timerState: "idle",
      remainingTime: (settings.focusDuration || 25) * 60,
      focusedSubtaskId: null,
      startTime: null,
    });
  }, [settings.focusDuration]);

  const switchTask = useCallback((taskId: string, subtaskId?: string) => {
    // Pause current timer
    const currentState = timerState;
    
    if (currentState.activeTaskId && currentState.timerState === "running") {
      pauseTimer();
    }

    // Start new timer for new task
    const focusDuration = (settings.focusDuration || 25) * 60;
    setTimerState({
      activeTaskId: taskId,
      timerState: "running",
      remainingTime: focusDuration,
      focusedSubtaskId: subtaskId || null,
      startTime: new Date(),
    });
  }, [timerState, pauseTimer, settings.focusDuration]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const value: FocusTimerContextValue = {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    switchTask,
    formatTime,
  };

  return (
    <FocusTimerContext.Provider value={value}>
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
