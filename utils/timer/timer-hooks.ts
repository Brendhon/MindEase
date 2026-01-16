/**
 * Timer Hooks - MindEase
 * Reusable hooks for timer management
 */

import { useEffect, useRef } from "react";
import { COUNTDOWN_INTERVAL_MS } from "./timer-constants";

/**
 * Hook to manage countdown interval
 * Handles setting up and cleaning up the countdown interval
 * 
 * @param isRunning - Whether the timer is currently running
 * @param onTick - Callback to execute on each tick
 */
export function useCountdownInterval(
  isRunning: boolean,
  onTick: () => void
): void {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up interval if timer is not running
    if (!isRunning) {
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
      onTick();
    }, COUNTDOWN_INTERVAL_MS);

    // Cleanup on unmount or when timer stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onTick]);
}

/**
 * Hook to persist timer state to localStorage
 * 
 * @param state - Current timer state
 * @param shouldPersist - Function that determines if state should be persisted
 * @param storage - Storage instance with get, set, remove methods
 */
export function useTimerPersistence<T>(
  state: T,
  shouldPersist: (state: T) => boolean,
  storage: { set: (state: T) => void; remove: () => void }
): void {
  useEffect(() => {
    if (shouldPersist(state)) {
      storage.set(state);
    } else {
      storage.remove();
    }
  }, [state, shouldPersist, storage]);
}

/**
 * Hook to initialize timer state from localStorage
 * 
 * @param onMount - Callback to execute on mount with saved state or null
 */
export function useTimerInitialization<T>(
  onMount: (saved: T | null) => void
): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;
    onMount(null); // Will be called by provider with actual saved state
  }, [onMount]);
}
