/**
 * Timer Restore - MindEase
 * Generic function to restore timer state from storage
 */

import { BaseTimerState } from "./timer-state";
import { calculateRemainingTime, isTimerCompleted } from "./timer-helpers";

/**
 * Configuration for restoring timer state
 */
export interface RestoreConfig<T extends BaseTimerState> {
  /** Field name that indicates the timer state (e.g., "timerState", "breakTimerState") */
  stateField: keyof T;
  /** Value that indicates running state (e.g., "running") */
  runningState: string;
  /** Function to create completed state when timer finished while away */
  createCompletedState: (activeTaskId: string | null, defaultDuration: number) => T;
}

/**
 * Restore timer state from storage, calculating remaining time if timer was running
 * Generic function that works with any timer state structure
 * 
 * @param saved - Saved state from storage
 * @param defaultDuration - Default duration in seconds
 * @param config - Configuration for restore behavior
 * @param currentTime - Current time (defaults to now)
 * @returns Restored timer state
 */
export function restoreTimerState<T extends BaseTimerState>(
  saved: T,
  defaultDuration: number,
  config: RestoreConfig<T>,
  currentTime: Date = new Date()
): T {
  const stateValue = saved[config.stateField];
  
  // If timer was running, recalculate remaining time
  if (stateValue === config.runningState && saved.startTime) {
    const startTime = new Date(saved.startTime);
    const remaining = calculateRemainingTime(
      startTime,
      saved.remainingTime,
      currentTime
    );

    // If timer completed while away, create completed state
    if (isTimerCompleted(remaining)) {
      return config.createCompletedState(saved.activeTaskId, defaultDuration);
    }

    // Otherwise, restore with recalculated time
    return {
      ...saved,
      remainingTime: remaining,
      startTime,
    };
  }

  // For other states, just restore as-is
  return saved;
}
