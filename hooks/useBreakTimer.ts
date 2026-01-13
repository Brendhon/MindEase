/**
 * useBreakTimer Hook - MindEase
 * Break timer management for Pomodoro sessions
 * 
 * Features:
 * - Single active break timer per session
 * - Timer state persistence across page navigation
 * - Simple state: idle, running, or breakEnded
 * - No task association (break is global)
 * - Integrated countdown and persistence logic
 * 
 * @example
 * ```tsx
 * const { breakTimerState, startBreak, stopBreak, formatTime } = useBreakTimer();
 * 
 * startBreak();
 * // Break timer starts running...
 * stopBreak();
 * // Break timer stops and resets
 * ```
 */

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Break Timer State Type
 */
export type BreakTimerStateType = "idle" | "running" | "breakEnded";

/**
 * Break Timer State
 */
export interface BreakTimerState {
  breakTimerState: BreakTimerStateType;
  remainingTime: number; // in seconds
  startTime: Date | null;
}

/**
 * Break Timer Context Value
 */
export interface BreakTimerContextValue {
  breakTimerState: BreakTimerState;
  startBreak: () => void;
  stopBreak: () => void;
  formatTime: (seconds: number) => string;
}

const STORAGE_KEY = "mindEase_breakTimer";
const COUNTDOWN_INTERVAL_MS = 1000;

/**
 * Format time in seconds to MM:SS string
 * Pure function - easily testable
 */
export function formatBreakTime(seconds: number): string {
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
 * Create initial break timer state
 * Pure function - easily testable
 */
function createInitialState(defaultDuration: number): BreakTimerState {
  return {
    breakTimerState: "idle",
    remainingTime: defaultDuration,
    startTime: null,
  };
}

/**
 * Create running break timer state
 * Pure function - easily testable
 */
function createRunningState(duration: number): BreakTimerState {
  return {
    breakTimerState: "running",
    remainingTime: duration,
    startTime: new Date(),
  };
}

/**
 * Create break ended state (when break completes, waits for user decision)
 * Pure function - easily testable
 */
function createBreakEndedState(defaultDuration: number): BreakTimerState {
  return {
    breakTimerState: "breakEnded",
    remainingTime: 0,
    startTime: null,
  };
}

/**
 * Create idle break timer state
 * Pure function - easily testable
 */
function createIdleState(defaultDuration: number): BreakTimerState {
  return {
    breakTimerState: "idle",
    remainingTime: defaultDuration,
    startTime: null,
  };
}

/**
 * Storage abstraction for testability
 * Allows mocking localStorage in tests
 */
const breakTimerStorage = {
  get: (): BreakTimerState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as BreakTimerState;
    } catch {
      return null;
    }
  },
  set: (state: BreakTimerState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving break timer state:", error);
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error removing break timer state:", error);
    }
  },
};

/**
 * Restore break timer state from storage, calculating remaining time if timer was running
 * Pure function - easily testable
 */
function restoreBreakTimerState(
  saved: BreakTimerState,
  defaultDuration: number,
  currentTime: Date = new Date()
): BreakTimerState {
  // If timer was running, recalculate remaining time
  if (saved.breakTimerState === "running" && saved.startTime) {
    const startTime = new Date(saved.startTime);
    const remaining = calculateRemainingTime(
      startTime,
      saved.remainingTime,
      currentTime
    );

    // If timer completed while away, return to breakEnded state
    if (isTimerCompleted(remaining)) {
      return createBreakEndedState(defaultDuration);
    }

    // Otherwise, restore with recalculated time
    return {
      ...saved,
      remainingTime: remaining,
      startTime,
    };
  }

  // For idle or breakEnded state, just restore as-is
  return saved;
}

/**
 * Hook for managing break timer state and operations
 */
export function useBreakTimer(): BreakTimerContextValue {
  const { settings } = useCognitiveSettings();
  const defaultDuration = useMemo(() => (settings.shortBreakDuration || 5) * 60, [settings.shortBreakDuration]);

  const [breakTimerState, setBreakTimerState] = useState<BreakTimerState>(() => 
    createInitialState(defaultDuration)
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Initialize: Load saved break timer state from localStorage on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const saved = breakTimerStorage.get();
    if (saved) {
      try {
        const restored = restoreBreakTimerState(saved, defaultDuration);
        setBreakTimerState(restored);
      } catch (error) {
        console.error("Error loading break timer state:", error);
        // On error, start with initial state
        setBreakTimerState(createInitialState(defaultDuration));
      }
    }
  }, [defaultDuration]);

  // Persist: Save break timer state to localStorage when it changes
  useEffect(() => {
    if (breakTimerState.breakTimerState !== "idle") {
      breakTimerStorage.set(breakTimerState);
    } else {
      breakTimerStorage.remove();
    }
  }, [breakTimerState]);

  // Countdown: Handle break timer countdown when running
  useEffect(() => {
    // Clean up interval if timer is not running
    if (breakTimerState.breakTimerState !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up interval for countdown
    intervalRef.current = setInterval(() => {
      setBreakTimerState((prev: BreakTimerState) => {
        // Check if timer should complete
        if (isTimerCompleted(prev.remainingTime)) {
          // Break timer completed - clear interval and set to breakEnded
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return createBreakEndedState(defaultDuration);
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
  }, [breakTimerState.breakTimerState, defaultDuration]);

  const startBreak = useCallback(() => {
    const breakDuration = (settings.shortBreakDuration || 5) * 60;
    setBreakTimerState(createRunningState(breakDuration));
  }, [settings.shortBreakDuration]);

  const stopBreak = useCallback(() => {
    setBreakTimerState(createIdleState(defaultDuration));
  }, [defaultDuration]);

  return {
    breakTimerState,
    startBreak,
    stopBreak,
    formatTime: formatBreakTime,
  };
}
