/**
 * useFocusTimer Hook - MindEase
 * Main hook for focus timer management
 * 
 * Features:
 * - Single active timer per session (one task at a time)
 * - Timer state persistence across page navigation
 * - Automatic task status updates (todo -> in_progress)
 * - Subtask focus tracking (optional)
 */

import { useState, useCallback, useMemo, useRef } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useTimerPersistence } from "@/hooks/useTimerPersistence";
import { useTimerCountdown } from "@/hooks/useTimerCountdown";
import type { TimerState, FocusTimerState, FocusTimerContextValue } from "@/contexts/focus-timer-context";

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
    focusedSubtaskId: null,
    startTime: null,
  });

  // Handle timer persistence
  useTimerPersistence(timerState, setTimerState, defaultDuration);

  // Handle timer countdown
  const handleTimerComplete = useCallback(() => {
    // Timer completed callback
    setTimerState((prev) => {
      if (prev.activeTaskId && onTaskStatusChangeRef.current) {
        // Don't auto-change status, let user decide
      }
      return prev;
    });
  }, []);

  useTimerCountdown(timerState, setTimerState, defaultDuration, handleTimerComplete);

  const startTimer = useCallback(
    (taskId: string, subtaskId?: string) => {
      const focusDuration = (settings.focusDuration || 25) * 60;

      setTimerState({
        activeTaskId: taskId,
        timerState: "running",
        remainingTime: focusDuration,
        focusedSubtaskId: subtaskId || null,
        startTime: new Date(),
      });
    },
    [settings.focusDuration]
  );

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      timerState: "paused",
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      timerState: "running",
      startTime: new Date(),
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState({
      activeTaskId: null,
      timerState: "idle",
      remainingTime: defaultDuration,
      focusedSubtaskId: null,
      startTime: null,
    });
  }, [defaultDuration]);

  const switchTask = useCallback(
    (taskId: string, subtaskId?: string) => {
      // Pause current timer if running, then start new timer
      setTimerState((prev) => {
        const focusDuration = (settings.focusDuration || 25) * 60;
        
        // If there's an active timer running, pause it first
        if (prev.activeTaskId && prev.timerState === "running") {
          // Start new timer for new task
          return {
            activeTaskId: taskId,
            timerState: "running",
            remainingTime: focusDuration,
            focusedSubtaskId: subtaskId || null,
            startTime: new Date(),
          };
        }

        // Start new timer for new task
        return {
          activeTaskId: taskId,
          timerState: "running",
          remainingTime: focusDuration,
          focusedSubtaskId: subtaskId || null,
          startTime: new Date(),
        };
      });
    },
    [settings.focusDuration]
  );

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    switchTask,
    formatTime,
  };
}
