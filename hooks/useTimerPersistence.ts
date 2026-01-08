/**
 * useTimerPersistence Hook - MindEase
 * Manages timer state persistence in localStorage
 */

import { useEffect, useRef } from "react";
import type { FocusTimerState } from "@/contexts/focus-timer-context";

const STORAGE_KEY = "mindEase_focusTimer";

/**
 * Hook to persist and restore timer state from localStorage
 */
export function useTimerPersistence(
  timerState: FocusTimerState,
  setTimerState: (state: FocusTimerState | ((prev: FocusTimerState) => FocusTimerState)) => void,
  defaultDuration: number
) {
  const isInitialMount = useRef(true);

  // Load saved timer state from localStorage on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: FocusTimerState = JSON.parse(saved);
        // Restore timer state if it was running
        if (parsed.timerState === "running" && parsed.startTime) {
          const startTime = new Date(parsed.startTime);
          const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
          const remaining = Math.max(0, parsed.remainingTime - elapsed);
          
          if (remaining > 0) {
            setTimerState({
              ...parsed,
              remainingTime: remaining,
              startTime,
            });
          } else {
            // Timer completed while away
            setTimerState({
              activeTaskId: null,
              timerState: "idle",
              remainingTime: defaultDuration,
              focusedSubtaskId: null,
              startTime: null,
            });
            localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          setTimerState(parsed);
        }
      } catch (err) {
        console.error("Error loading timer state:", err);
      }
    }
  }, []); // Only run on mount

  // Save timer state to localStorage
  useEffect(() => {
    if (timerState.timerState !== "idle") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timerState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [timerState]);
}
