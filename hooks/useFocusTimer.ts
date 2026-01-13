/**
 * useFocusTimer Hook - MindEase
 * Simplified focus timer management
 * 
 * Features:
 * - Single active timer per session (one task at a time)
 * - Timer state persistence across page navigation
 * - Simple state: idle or running (no pause)
 * - Task association only (no subtask tracking)
 * - Integrated countdown and persistence logic
 */

import type { FocusTimerContextValue, FocusTimerState } from "@/contexts/focus-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "mindEase_focusTimer";

/**
 * Format time in seconds to MM:SS string
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Hook for managing focus timer state and operations
 */
export function useFocusTimer(
  onTaskStatusChange?: (taskId: string, status: number) => void
): FocusTimerContextValue {
  const { settings } = useCognitiveSettings();
  const defaultDuration = useMemo(() => (settings.focusDuration || 25) * 60, [settings.focusDuration]);
  
  // Store callback in ref to avoid recreating it
  const onTaskStatusChangeRef = useRef(onTaskStatusChange);
  onTaskStatusChangeRef.current = onTaskStatusChange;

  const [timerState, setTimerState] = useState<FocusTimerState>({
    activeTaskId: null,
    timerState: "idle",
    remainingTime: defaultDuration,
    startTime: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
  }, [defaultDuration]);

  // Save timer state to localStorage
  useEffect(() => {
    if (timerState.timerState !== "idle") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timerState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [timerState]);

  // Handle timer countdown
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
  }, [timerState.timerState, defaultDuration]);

  const startTimer = useCallback(
    (taskId: string) => {
      const focusDuration = (settings.focusDuration || 25) * 60;

      setTimerState({
        activeTaskId: taskId,
        timerState: "running",
        remainingTime: focusDuration,
        startTime: new Date(),
      });
    },
    [settings.focusDuration]
  );

  const stopTimer = useCallback(() => {
    setTimerState({
      activeTaskId: null,
      timerState: "idle",
      remainingTime: defaultDuration,
      startTime: null,
    });
  }, [defaultDuration]);

  return {
    timerState,
    startTimer,
    stopTimer,
    formatTime,
  };
}
