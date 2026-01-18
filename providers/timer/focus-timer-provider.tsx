'use client';

import { FocusTimerContext } from '@/contexts/timer';
import {
  FocusTimerAction,
  FocusTimerContextValue,
  FocusTimerState,
} from '@/models/timer';
import { useCognitiveSettings } from '@/hooks/cognitive-settings';
import { useCountdownInterval } from '@/hooks/timer';
import {
  createCompletedTimerState,
  createIdleTimerState,
  createInitialTimerState,
  createRunningTimerState,
  isTimerCompleted,
} from '@/utils/timer';
import { ReactNode, useCallback, useMemo, useReducer } from 'react';

/**
 * Focus Timer Provider Props
 */
export interface FocusTimerProviderProps {
  children: ReactNode;
}

// State creation functions using shared utilities
const createInitialState = (defaultDuration: number) =>
  createInitialTimerState<FocusTimerState>(
    defaultDuration,
    'timerState',
    'idle'
  );

const createRunningState = (taskId: string, duration: number) =>
  createRunningTimerState<FocusTimerState>(
    duration,
    'timerState',
    'running',
    taskId
  );

const createIdleState = (defaultDuration: number) =>
  createIdleTimerState<FocusTimerState>(defaultDuration, 'timerState', 'idle');

/**
 * Timer reducer function
 * Handles all state transitions
 */
function timerReducer(
  state: FocusTimerState,
  action: FocusTimerAction
): FocusTimerState {
  switch (action.type) {
    case 'START':
      return createRunningState(action.taskId, action.duration);
    case 'STOP':
      return createIdleState(action.defaultDuration);
    case 'TICK':
      // Decrement time
      const remainingTime = state.remainingTime - 1;

      // If timer completed, preserve activeTaskId for dialog detection and set to idle
      return isTimerCompleted(remainingTime)
        ? createCompletedTimerState(
            state.activeTaskId,
            action.defaultDuration,
            'timerState',
            'idle'
          )
        : { ...state, remainingTime };
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
 */
export function FocusTimerProvider({ children }: FocusTimerProviderProps) {
  const { settings } = useCognitiveSettings();
  const defaultDuration = useMemo(
    () => (settings.focusDuration || 25) * 60,
    [settings.focusDuration]
  );

  // Initialize state with default duration
  const [timerState, dispatch] = useReducer(
    timerReducer,
    defaultDuration,
    (duration) => createInitialState(duration)
  );

  // Countdown: Handle timer countdown when running
  const handleTick = useCallback(() => {
    dispatch({ type: 'TICK', defaultDuration });
  }, [defaultDuration]);

  useCountdownInterval(timerState.timerState === 'running', handleTick);

  // Start timer function
  const startTimer = useCallback(
    (taskId: string) => {
      const focusDuration = (settings.focusDuration || 25) * 60;
      dispatch({ type: 'START', taskId, duration: focusDuration });
    },
    [settings.focusDuration]
  );

  // Stop timer function
  const stopTimer = useCallback(() => {
    dispatch({ type: 'STOP', defaultDuration });
  }, [defaultDuration]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<FocusTimerContextValue>(
    () => ({
      timerState,
      startTimer,
      stopTimer,
      isActive: (taskId?: string | undefined) =>
        taskId ? timerState.activeTaskId === taskId : !!timerState.activeTaskId,
      isRunning: (taskId?: string | undefined) =>
        taskId
          ? timerState.activeTaskId === taskId &&
            timerState.timerState === 'running'
          : timerState.timerState === 'running',
      hasActiveTask: !!timerState.activeTaskId,
      remainingTime: timerState.remainingTime,
    }),
    [timerState, startTimer, stopTimer]
  );

  return (
    <FocusTimerContext.Provider value={contextValue}>
      {children}
    </FocusTimerContext.Provider>
  );
}
