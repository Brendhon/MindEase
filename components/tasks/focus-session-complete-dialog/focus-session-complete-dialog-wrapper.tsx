"use client";

import { useFocusTimer } from "@/contexts/focus-timer-context";
import { useAuth } from "@/hooks/useAuth";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Task } from "@/models/Task";
import { tasksService } from "@/services/tasks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FocusSessionCompleteDialog } from "./focus-session-complete-dialog";

/**
 * FocusSessionCompleteDialogWrapper Component - MindEase
 * Global wrapper for the focus session complete dialog
 * Monitors timer state and shows dialog when timer completes
 */
export function FocusSessionCompleteDialogWrapper() {
  const { user } = useAuth();
  const { timerState, stopTimer, resumeTimer, startTimer } = useFocusTimer();
  const { settings } = useCognitiveSettings();

  const [showSessionCompleteDialog, setShowSessionCompleteDialog] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);

  // Monitor timer completion - use a ref to track previous state
  const prevTimerStateRef = useRef(timerState);

  // Fetch active task when needed
  const fetchActiveTask = useCallback(async (taskId: string) => {
    if (!user?.uid) return;

    setLoadingTask(true);
    try {
      const task = await tasksService.getTask(user.uid, taskId);
      setActiveTask(task);
    } catch (error) {
      console.error("Error fetching active task:", error);
      setActiveTask(null);
    } finally {
      setLoadingTask(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    const prev = prevTimerStateRef.current;
    const current = timerState;

    // Detect when timer completes: was running, now idle, but still has activeTaskId
    // This happens when useTimerCountdown resets the state but before activeTaskId is cleared
    // We detect the transition from "running" to "idle" while activeTaskId is still present
    if (
      prev.timerState === "running" &&
      current.timerState === "idle" &&
      current.activeTaskId !== null &&
      prev.activeTaskId === current.activeTaskId
    ) {
      // Fetch the task and show dialog
      if (current.activeTaskId) {
        fetchActiveTask(current.activeTaskId);
        setShowSessionCompleteDialog(true);
      }
    }

    // Hide dialog when timer is fully stopped (no activeTaskId)
    if (current.timerState === "idle" && current.activeTaskId === null) {
      setShowSessionCompleteDialog(false);
      setActiveTask(null);
    }

    prevTimerStateRef.current = current;
  }, [timerState, fetchActiveTask]);

  // Focus session complete dialog handlers
  const handleStartBreak = useCallback(() => {
    // Stop timer to start break (guided decision - no manual pause)
    stopTimer();
  }, [stopTimer]);

  const handleContinueFocus = useCallback(() => {
    // Start a new focus session (new Pomodoro)
    if (timerState.activeTaskId) {
      const subtaskId = timerState.focusedSubtaskId || undefined;
      // Start new timer (new Pomodoro)
      startTimer(timerState.activeTaskId, subtaskId);
    }
  }, [timerState.activeTaskId, timerState.focusedSubtaskId, startTimer]);

  const handleFinishTask = useCallback(async () => {
    if (!user?.uid || !timerState.activeTaskId) return;

    try {
      // Update task status to completed (2)
      await tasksService.updateTask(user.uid, timerState.activeTaskId, { status: 2 });
      stopTimer();
    } catch (error) {
      console.error("Error finishing task:", error);
    }
  }, [user?.uid, timerState.activeTaskId, stopTimer]);

  const handleCloseSessionDialog = useCallback(() => {
    setShowSessionCompleteDialog(false);
  }, []);

  // Get focus duration in minutes
  const focusDuration = useMemo(() => settings.focusDuration || 25, [settings.focusDuration]);
  const breakDuration = useMemo(() => settings.shortBreakDuration || 5, [settings.shortBreakDuration]);

  return (
    <FocusSessionCompleteDialog
      isOpen={showSessionCompleteDialog}
      onClose={handleCloseSessionDialog}
      focusDuration={focusDuration}
      breakDuration={breakDuration}
      activeTask={activeTask}
      onStartBreak={handleStartBreak}
      onContinueFocus={handleContinueFocus}
      onFinishTask={handleFinishTask}
    />
  );
}

FocusSessionCompleteDialogWrapper.displayName = "FocusSessionCompleteDialogWrapper";
