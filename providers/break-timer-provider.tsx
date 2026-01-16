"use client";

import { ReactNode, useReducer, useEffect, useRef, useMemo, useCallback } from "react";
import { BreakTimerContext, BreakTimerState, BreakTimerAction } from "@/contexts/break-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { formatTime as formatTimeUtil, isTimerCompleted } from "@/utils/timer/timer-helpers";
import { createTimerStorage } from "@/utils/timer/timer-storage";
import {
  createInitialTimerState,
  createRunningTimerState,
  createIdleTimerState,
  createBreakEndedTimerState,
} from "@/utils/timer/timer-state";
import { restoreTimerState } from "@/utils/timer/timer-restore";
import { useCountdownInterval, useTimerPersistence } from "@/utils/timer/timer-hooks";

/**
 * Re-export formatTime for convenience
 */
export const formatTime = formatTimeUtil;

/**
 * Break Timer Provider Props
 */
export interface BreakTimerProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "mindEase_breakTimer";

// Create storage instance
const breakTimerStorage = createTimerStorage<BreakTimerState>(STORAGE_KEY, "break timer");

// State creation functions using shared utilities
const createInitialState = (defaultDuration: number) =>
  createInitialTimerState<BreakTimerState>(defaultDuration, "breakTimerState", "idle");

const createRunningState = (duration: number, taskId?: string) =>
  createRunningTimerState<BreakTimerState>(duration, "breakTimerState", "running", taskId);

const createIdleState = (defaultDuration: number) =>
  createIdleTimerState<BreakTimerState>(defaultDuration, "breakTimerState", "idle");

const createBreakEndedState = (defaultDuration: number, taskId?: string | null) =>
  createBreakEndedTimerState<BreakTimerState>(defaultDuration, "breakTimerState", "breakEnded", taskId);

/**
 * Restore break timer state using shared restore function
 */
function restoreBreakTimerState(
  saved: BreakTimerState,
  defaultDuration: number
): BreakTimerState {
  return restoreTimerState(saved, defaultDuration, {
    stateField: "breakTimerState",
    runningState: "running",
    createCompletedState: (activeTaskId, defaultDuration) =>
      createBreakEndedState(defaultDuration, activeTaskId),
  });
}

/**
 * Break timer reducer function
 * Handles all state transitions
 */
function breakTimerReducer(
  state: BreakTimerState,
  action: BreakTimerAction
): BreakTimerState {
  switch (action.type) {
    case "START":
      return createRunningState(action.duration, action.taskId);
    case "STOP":
      return createIdleState(action.defaultDuration);
    case "TICK":
      // Decrement time
      const newRemainingTime = state.remainingTime - 1;
      
      // If timer completed, preserve activeTaskId for dialog detection and set to breakEnded
      if (isTimerCompleted(newRemainingTime)) {
        return createBreakEndedState(action.defaultDuration, state.activeTaskId);
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
 * Break Timer Provider Component - MindEase
 * Provides break timer context to children components
 * 
 * This provider manages all break timer logic including:
 * - State management with useReducer
 * - Countdown intervals
 * - localStorage persistence
 * - Initialization and restoration
 */
export function BreakTimerProvider({
  children,
}: BreakTimerProviderProps) {
  const { settings } = useCognitiveSettings();
  const defaultDuration = useMemo(() => (settings.shortBreakDuration || 5) * 60, [settings.shortBreakDuration]);

  // Initialize state with default duration
  const [breakTimerState, dispatch] = useReducer(
    breakTimerReducer,
    defaultDuration,
    (duration) => createInitialState(duration)
  );

  const isInitialMount = useRef(true);
  const defaultDurationRef = useRef(defaultDuration);

  // Keep defaultDuration ref in sync
  useEffect(() => {
    defaultDurationRef.current = defaultDuration;
  }, [defaultDuration]);

  // Initialize: Load saved break timer state from localStorage on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const saved = breakTimerStorage.get();
    if (saved) {
      try {
        const restored = restoreBreakTimerState(saved, defaultDurationRef.current);
        dispatch({ type: "RESTORE", state: restored });
      } catch (error) {
        console.error("Error loading break timer state:", error);
        // On error, start with initial state
        dispatch({ type: "RESTORE", state: createInitialState(defaultDurationRef.current) });
      }
    }
  }, []); // Empty deps - only run on mount

  // Persist: Save break timer state to localStorage when it changes
  // Save if running OR if breakEnded OR if idle but has activeTaskId
  useTimerPersistence(
    breakTimerState,
    (state) => state.breakTimerState !== "idle" || state.activeTaskId !== null,
    breakTimerStorage
  );

  // Countdown: Handle break timer countdown when running
  const handleTick = useCallback(() => {
    dispatch({ type: "TICK", defaultDuration: defaultDurationRef.current });
  }, []);
  
  useCountdownInterval(breakTimerState.breakTimerState === "running", handleTick);

  // Start break function
  const startBreak = useCallback(
    (taskId?: string) => {
      const breakDuration = (settings.shortBreakDuration || 5) * 60;
      dispatch({ type: "START", duration: breakDuration, taskId });
    },
    [settings.shortBreakDuration]
  );

  // Stop break function
  const stopBreak = useCallback(() => {
    dispatch({ type: "STOP", defaultDuration });
  }, [defaultDuration]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      breakTimerState,
      startBreak,
      stopBreak,
      formatTime: formatTimeUtil,
    }),
    [breakTimerState, startBreak, stopBreak]
  );

  return (
    <BreakTimerContext.Provider value={contextValue}>
      {children}
    </BreakTimerContext.Provider>
  );
}
