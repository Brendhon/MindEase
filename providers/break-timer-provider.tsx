"use client";

import { BreakTimerAction, BreakTimerContext, BreakTimerState } from "@/contexts/break-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import {
  createBreakEndedTimerState,
  createIdleTimerState,
  createInitialTimerState,
  createRunningTimerState,
  isTimerCompleted,
  useCountdownInterval,
} from "@/utils/timer";
import { ReactNode, useCallback, useMemo, useReducer } from "react";


/**
 * Break Timer Provider Props
 */
export interface BreakTimerProviderProps {
  children: ReactNode;
}

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
      const remainingTime = state.remainingTime - 1;

      // If timer completed, preserve activeTaskId for dialog detection and set to breakEnded
      return isTimerCompleted(remainingTime)
        ? createBreakEndedState(action.defaultDuration, state.activeTaskId)
        : { ...state, remainingTime };
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

  // Countdown: Handle break timer countdown when running
  const handleTick = useCallback(() => {
    dispatch({ type: "TICK", defaultDuration });
  }, [defaultDuration]);

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
      isActive: (taskId: string) => breakTimerState.activeTaskId === taskId,
      isRunning: (taskId: string) => breakTimerState.activeTaskId === taskId && breakTimerState.breakTimerState === "running",
      hasActiveTask: !!breakTimerState.activeTaskId,
      remainingTime: breakTimerState.remainingTime,
    }),
    [breakTimerState, startBreak, stopBreak]
  );

  return (
    <BreakTimerContext.Provider value={contextValue}>
      {children}
    </BreakTimerContext.Provider>
  );
}
