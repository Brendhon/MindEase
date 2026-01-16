"use client";

import { ReactNode, useReducer, useEffect, useRef, useMemo, useCallback } from "react";
import { FocusTimerContext, FocusTimerState, TimerAction } from "@/contexts/focus-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

/**
 * Focus Timer Provider Props
 */
export interface FocusTimerProviderProps {
  children: ReactNode;
}

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

    // If timer completed while away, preserve activeTaskId if exists for dialog detection
    if (isTimerCompleted(remaining)) {
      return {
        activeTaskId: saved.activeTaskId, // Preserve for dialog detection
        timerState: "idle",
        remainingTime: defaultDuration,
        startTime: null,
      };
    }

    // Otherwise, restore with recalculated time
    return {
      ...saved,
      remainingTime: remaining,
      startTime,
    };
  }

  // For idle state, just restore as-is (may have activeTaskId if completed)
  return saved;
}

/**
 * Timer reducer function
 * Handles all state transitions
 */
function timerReducer(
  state: FocusTimerState,
  action: TimerAction
): FocusTimerState {
  switch (action.type) {
    case "START":
      return createRunningState(action.taskId, action.duration);
    case "STOP":
      return createIdleState(action.defaultDuration);
    case "TICK":
      // Decrement time
      const newRemainingTime = state.remainingTime - 1;
      
      // If timer completed, preserve activeTaskId for dialog detection and set to idle
      if (isTimerCompleted(newRemainingTime)) {
        return {
          activeTaskId: state.activeTaskId, // Preserve for dialog detection
          timerState: "idle",
          remainingTime: action.defaultDuration,
          startTime: null,
        };
      }
      
      return {
        ...state,
        remainingTime: newRemainingTime,
      };
    case "RESTORE":
      return action.state;
    default:
      return state;
  }
}

/**
 * Focus Timer Provider Component - MindEase
 * Provides focus timer context to children components
 * 
 * This provider manages all timer logic including:
 * - State management with useReducer
 * - Countdown intervals
 * - localStorage persistence
 * - Initialization and restoration
 */
export function FocusTimerProvider({
  children,
}: FocusTimerProviderProps) {
  const { settings } = useCognitiveSettings();
  const defaultDuration = useMemo(() => (settings.focusDuration || 25) * 60, [settings.focusDuration]);

  // Initialize state with default duration
  const [timerState, dispatch] = useReducer(
    timerReducer,
    defaultDuration,
    (duration) => createInitialState(duration)
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const defaultDurationRef = useRef(defaultDuration);

  // Keep defaultDuration ref in sync
  useEffect(() => {
    defaultDurationRef.current = defaultDuration;
  }, [defaultDuration]);

  // Initialize: Load saved timer state from localStorage on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const saved = timerStorage.get();
    if (saved) {
      try {
        const restored = restoreTimerState(saved, defaultDurationRef.current);
        dispatch({ type: "RESTORE", state: restored });
      } catch (error) {
        console.error("Error loading timer state:", error);
        // On error, start with initial state
        dispatch({ type: "RESTORE", state: createInitialState(defaultDurationRef.current) });
      }
    } else {
      // Initialize with default state if no saved state
      dispatch({ type: "RESTORE", state: createInitialState(defaultDurationRef.current) });
    }
  }, []); // Empty deps - only run on mount

  // Persist: Save timer state to localStorage when it changes
  // Only persist if running, or if idle but has activeTaskId (completed state for dialog)
  useEffect(() => {
    if (timerState.timerState === "running" || (timerState.timerState === "idle" && timerState.activeTaskId)) {
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

    // Clear any existing interval before creating a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set up interval for countdown
    intervalRef.current = setInterval(() => {
      dispatch({ type: "TICK", defaultDuration: defaultDurationRef.current });
    }, COUNTDOWN_INTERVAL_MS);

    // Cleanup on unmount or when timer stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.timerState]); // Only depend on timerState.timerState

  // Start timer function
  const startTimer = useCallback(
    (taskId: string) => {
      const focusDuration = (settings.focusDuration || 25) * 60;
      dispatch({ type: "START", taskId, duration: focusDuration });
    },
    [settings.focusDuration]
  );

  // Stop timer function
  const stopTimer = useCallback(() => {
    dispatch({ type: "STOP", defaultDuration });
  }, [defaultDuration]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      timerState,
      startTimer,
      stopTimer,
      formatTime,
    }),
    [timerState, startTimer, stopTimer]
  );

  return (
    <FocusTimerContext.Provider value={contextValue}>
      {children}
    </FocusTimerContext.Provider>
  );
}
