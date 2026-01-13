/**
 * useFocusTimer Hook - MindEase
 * Simplified focus timer management
 * 
 * Features:
 * - Single active timer per session (one task at a time)
 * - Timer state persistence across page navigation
 * - Simple state: idle or running (no pause)
 * - Task association only (no subtask tracking)
 * - Integrated countdown and persistence logic
 * 
 * @example
 * ```tsx
 * const { timerState, startTimer, stopTimer, formatTime } = useFocusTimer();
 * 
 * startTimer("task-123");
 * // Timer starts running...
 * stopTimer();
 * // Timer stops and resets
 * ```
 */

import type { FocusTimerContextValue, FocusTimerState } from "@/contexts/focus-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "mindEase_focusTimer";
const COUNTDOWN_INTERVAL_MS = 1000;

/**
 * Format time in seconds to MM:SS string
 * Pure function - easily testable
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Calculate remaining time based on start time and initial duration
 * Pure function - easily testable
 */
function calculateRemainingTime(
  startTime: Date,
  initialDuration: number,
  currentTime: Date = new Date()
): number {
  const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
  return Math.max(0, initialDuration - elapsed);
}

/**
 * Check if timer has completed based on remaining time
 * Pure function - easily testable
 */
function isTimerCompleted(remainingTime: number): boolean {
  return remainingTime <= 0;
}

/**
 * Create initial timer state
 * Pure function - easily testable
 */
function createInitialState(defaultDuration: number): FocusTimerState {
  return {
    activeTaskId: null,
    timerState: "idle",
    remainingTime: defaultDuration,
    startTime: null,
  };
}

/**
 * Create running timer state
 * Pure function - easily testable
 */
function createRunningState(taskId: string, duration: number): FocusTimerState {
  return {
    activeTaskId: taskId,
    timerState: "running",
    remainingTime: duration,
    startTime: new Date(),
  };
}

/**
 * Create idle timer state
 * Pure function - easily testable
 */
function createIdleState(defaultDuration: number): FocusTimerState {
  return {
    activeTaskId: null,
    timerState: "idle",
    remainingTime: defaultDuration,
    startTime: null,
  };
}

/**
 * Storage abstraction for testability
 * Allows mocking localStorage in tests
 */
const timerStorage = {
  get: (): FocusTimerState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as FocusTimerState;
    } catch {
      return null;
    }
  },
  set: (state: FocusTimerState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving timer state:", error);
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error removing timer state:", error);
    }
  },
};

/**
 * Restore timer state from storage, calculating remaining time if timer was running
 * Pure function - easily testable
 */
function restoreTimerState(
  saved: FocusTimerState,
  defaultDuration: number,
  currentTime: Date = new Date()
): FocusTimerState {
  // If timer was running, recalculate remaining time
  if (saved.timerState === "running" && saved.startTime) {
    const startTime = new Date(saved.startTime);
    const remaining = calculateRemainingTime(
      startTime,
      saved.remainingTime,
      currentTime
    );

    // If timer completed while away, return to idle
    if (isTimerCompleted(remaining)) {
      return createIdleState(defaultDuration);
    }

    // Otherwise, restore with recalculated time
    return {
      ...saved,
      remainingTime: remaining,
      startTime,
    };
  }

  // For idle state, just restore as-is
  return saved;
}

/**
 * Hook for managing focus timer state and operations
 * 
 * @param onTaskStatusChange - Optional callback for task status changes (currently unused but kept for future use)
 */
export function useFocusTimer(
  onTaskStatusChange?: (taskId: string, status: number) => void
): FocusTimerContextValue {
  const { settings } = useCognitiveSettings();
  const defaultDuration = useMemo(() => (settings.focusDuration || 25) * 60, [settings.focusDuration]);
  
  // Store callback in ref to avoid recreating it (for potential future use)
  const onTaskStatusChangeRef = useRef(onTaskStatusChange);
  onTaskStatusChangeRef.current = onTaskStatusChange;

  const [timerState, setTimerState] = useState<FocusTimerState>(() => 
    createInitialState(defaultDuration)
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Initialize: Load saved timer state from localStorage on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const saved = timerStorage.get();
    if (saved) {
      try {
        const restored = restoreTimerState(saved, defaultDuration);
        setTimerState(restored);
      } catch (error) {
        console.error("Error loading timer state:", error);
        // On error, start with initial state
        setTimerState(createInitialState(defaultDuration));
      }
    }
  }, [defaultDuration]);

  // Persist: Save timer state to localStorage when it changes
  useEffect(() => {
    if (timerState.timerState !== "idle") {
      timerStorage.set(timerState);
    } else {
      timerStorage.remove();
    }
  }, [timerState]);

  // Countdown: Handle timer countdown when running
  useEffect(() => {
    // Clean up interval if timer is not running
    if (timerState.timerState !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up interval for countdown
    intervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        // Check if timer should complete
        if (isTimerCompleted(prev.remainingTime)) {
          // Timer completed - clear interval and reset to idle
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return createIdleState(defaultDuration);
        }

        // Decrement remaining time
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, COUNTDOWN_INTERVAL_MS);

    // Cleanup on unmount or when timer stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.timerState, defaultDuration]);

  const startTimer = useCallback(
    (taskId: string) => {
      const focusDuration = (settings.focusDuration || 25) * 60;
      setTimerState(createRunningState(taskId, focusDuration));
    },
    [settings.focusDuration]
  );

  const stopTimer = useCallback(() => {
    setTimerState(createIdleState(defaultDuration));
  }, [defaultDuration]);

  return {
    timerState,
    startTimer,
    stopTimer,
    formatTime,
  };
}
