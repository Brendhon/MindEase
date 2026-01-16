"use client";

import { ReactNode, useReducer, useEffect, useRef, useMemo, useCallback } from "react";
import { FocusTimerContext, FocusTimerState, TimerAction } from "@/contexts/focus-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { formatTime as formatTimeUtil, isTimerCompleted } from "@/utils/timer/timer-helpers";
import { createTimerStorage } from "@/utils/timer/timer-storage";
import {
  createInitialTimerState,
  createRunningTimerState,
  createIdleTimerState,
  createCompletedTimerState,
} from "@/utils/timer/timer-state";
import { restoreTimerState } from "@/utils/timer/timer-restore";
import { useCountdownInterval, useTimerPersistence } from "@/utils/timer/timer-hooks";

/**
 * Re-export formatTime for convenience
 */
export const formatTime = formatTimeUtil;

/**
 * Focus Timer Provider Props
 */
export interface FocusTimerProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "mindEase_focusTimer";

// Create storage instance
const timerStorage = createTimerStorage<FocusTimerState>(STORAGE_KEY, "timer");

// State creation functions using shared utilities
const createInitialState = (defaultDuration: number) =>
  createInitialTimerState<FocusTimerState>(defaultDuration, "timerState", "idle");

const createRunningState = (taskId: string, duration: number) =>
  createRunningTimerState<FocusTimerState>(duration, "timerState", "running", taskId);

const createIdleState = (defaultDuration: number) =>
  createIdleTimerState<FocusTimerState>(defaultDuration, "timerState", "idle");

/**
 * Restore timer state using shared restore function
 */
function restoreFocusTimerState(
  saved: FocusTimerState,
  defaultDuration: number
): FocusTimerState {
  return restoreTimerState(saved, defaultDuration, {
    stateField: "timerState",
    runningState: "running",
    createCompletedState: (activeTaskId, defaultDuration) =>
      createCompletedTimerState(activeTaskId, defaultDuration, "timerState", "idle"),
  });
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
        return createCompletedTimerState(
          state.activeTaskId,
          action.defaultDuration,
          "timerState",
          "idle"
        );
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
        const restored = restoreFocusTimerState(saved, defaultDurationRef.current);
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
  useTimerPersistence(
    timerState,
    (state) => state.timerState === "running" || (state.timerState === "idle" && state.activeTaskId !== null),
    timerStorage
  );

  // Countdown: Handle timer countdown when running
  const handleTick = useCallback(() => {
    dispatch({ type: "TICK", defaultDuration: defaultDurationRef.current });
  }, []);
  
  useCountdownInterval(timerState.timerState === "running", handleTick);

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
      formatTime: formatTimeUtil,
    }),
    [timerState, startTimer, stopTimer]
  );

  return (
    <FocusTimerContext.Provider value={contextValue}>
      {children}
    </FocusTimerContext.Provider>
  );
}
