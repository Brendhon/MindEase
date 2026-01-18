/**
 * Timer Hooks - MindEase
 * Reusable hooks for timer management
 */

import { useEffect, useRef } from 'react';
import { COUNTDOWN_INTERVAL_MS } from '@/utils/timer/timer-constants';

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
