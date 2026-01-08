/**
 * useTimerCountdown Hook - MindEase
 * Manages timer countdown logic
 */

import { useEffect, useRef } from "react";
import type { FocusTimerState } from "@/contexts/focus-timer-context";

/**
 * Hook to manage timer countdown interval
 */
export function useTimerCountdown(
  timerState: FocusTimerState,
  setTimerState: (state: FocusTimerState | ((prev: FocusTimerState) => FocusTimerState)) => void,
  defaultDuration: number,
  onComplete?: () => void
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerState.timerState !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        if (prev.remainingTime <= 1) {
          // Timer completed
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Notify completion
          if (onComplete) {
            onComplete();
          }

          return {
            ...prev,
            timerState: "idle",
            remainingTime: defaultDuration,
            startTime: null,
          };
        }

        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.timerState, defaultDuration, onComplete, setTimerState]);
}
