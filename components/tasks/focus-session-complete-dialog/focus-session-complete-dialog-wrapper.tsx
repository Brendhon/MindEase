"use client";

import { useMissingBreakAlert, useProlongedNavigationAlert } from "@/hooks/cognitive-alerts";
import { useBreakTimer, useFocusTimer } from "@/hooks/timer";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useTasks } from "@/hooks/tasks";
import { Task } from "@/models/task";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FocusSessionCompleteDialog } from "./focus-session-complete-dialog";

/**
 * FocusSessionCompleteDialogWrapper Component - MindEase
 * Global wrapper for the focus session complete dialog
 * Monitors timer state and shows dialog when timer completes
 */
export function FocusSessionCompleteDialogWrapper() {
  const { timerState, stopTimer, startTimer } = useFocusTimer();
  const { startBreak } = useBreakTimer();
  const { settings } = useCognitiveSettings();
  const { recordFocusSessionComplete, recordTaskFinished } = useMissingBreakAlert();
  const { recordUserAction } = useProlongedNavigationAlert();
  const { updateTaskStatus, getTask, refreshTask } = useTasks();

  const [showSessionCompleteDialog, setShowSessionCompleteDialog] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);

  // Monitor timer completion - use a ref to track previous state
  const prevTimerStateRef = useRef(timerState);

  // Fetch active task when needed
  const fetchActiveTask = useCallback(async (taskId: string) => {
    setLoadingTask(true);
    try {
      // First try to get from local state
      let task = getTask(taskId);
      
      // If not found locally, refresh from Firestore
      if (!task) {
        await refreshTask(taskId);
        task = getTask(taskId);
      }
      
      setActiveTask(task || null);
    } catch (error) {
      console.error("Error fetching active task:", error);
      setActiveTask(null);
    } finally {
      setLoadingTask(false);
    }
  }, [getTask, refreshTask]);

  useEffect(() => {
    const prev = prevTimerStateRef.current;
    const current = timerState;

    // Detect when timer completes: was running, now idle, but still has activeTaskId
    // This happens when the timer countdown completes and resets the state but before activeTaskId is cleared
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
    // Stop focus timer and start break timer with activeTaskId
    if (timerState.activeTaskId) {
      stopTimer();
      startBreak(timerState.activeTaskId);
    }
    // Dialog will close itself via onClose callback
  }, [timerState.activeTaskId, stopTimer, startBreak]);

  const handleContinueFocus = useCallback(() => {
    // Start a new focus session (new Pomodoro)
    if (timerState.activeTaskId) {
      // Start new timer (new Pomodoro) - this changes state to "running"
      startTimer(timerState.activeTaskId);
      // Record that focus session was completed without break
      recordFocusSessionComplete();
      // Record user action (resets prolonged navigation timer)
      recordUserAction();
    }
    // Dialog will close itself via onClose callback
  }, [timerState.activeTaskId, startTimer, recordFocusSessionComplete, recordUserAction]);

  const handleFinishTask = useCallback(async () => {
    if (!timerState.activeTaskId) return;

    try {
      // Update task status to completed (2) - automatically syncs with Firestore and updates UI
      await updateTaskStatus(timerState.activeTaskId, 2);
      stopTimer(); // This clears activeTaskId and resets to idle
      // Record that task was finished (reset counter)
      recordTaskFinished();
    } catch (error) {
      console.error("Error finishing task:", error);
    }
    // Dialog will close itself via onClose callback
  }, [timerState.activeTaskId, stopTimer, updateTaskStatus, recordTaskFinished]);

  const handleCloseSessionDialog = useCallback(() => {
    // Dialog should not close without action (preventClose={true})
    // But if it does, ensure state is cleaned up
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
