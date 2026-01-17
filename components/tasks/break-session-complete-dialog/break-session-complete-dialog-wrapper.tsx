"use client";

import { useMissingBreakAlert, useProlongedNavigationAlert } from "@/hooks/cognitive-alerts";
import { useBreakTimer } from "@/hooks/useBreakTimer";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTasks } from "@/hooks/useTasks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BreakSessionCompleteDialog } from "./break-session-complete-dialog";

/**
 * BreakSessionCompleteDialogWrapper Component - MindEase
 * Global wrapper for the break session complete dialog
 * Monitors break timer state and shows dialog when break timer completes
 */
export function BreakSessionCompleteDialogWrapper() {
  const { breakTimerState, stopBreak } = useBreakTimer();
  const { startTimer, stopTimer } = useFocusTimer();
  const { settings } = useCognitiveSettings();
  const { recordBreakComplete, recordTaskFinished } = useMissingBreakAlert();
  const { recordUserAction } = useProlongedNavigationAlert();
  const { updateTaskStatus } = useTasks();

  const [showBreakCompleteDialog, setShowBreakCompleteDialog] = useState(false);

  // Monitor break timer completion - use a ref to track previous state
  const prevBreakTimerStateRef = useRef(breakTimerState);

  useEffect(() => {
    const prev = prevBreakTimerStateRef.current;
    const current = breakTimerState;

    // Detect when break timer completes: was running, now breakEnded
    if (
      prev.breakTimerState === "running" &&
      current.breakTimerState === "breakEnded"
    ) {
      // Show dialog when break completes
      setShowBreakCompleteDialog(true);
    }

    // Hide dialog when break timer is fully stopped (idle)
    if (current.breakTimerState === "idle") {
      setShowBreakCompleteDialog(false);
    }

    prevBreakTimerStateRef.current = current;
  }, [breakTimerState]);

  // Break session complete dialog handlers
  const handleStartFocus = useCallback(() => {
    // Stop break timer
    stopBreak();
    
    // Start new focus session if there's an active task in break timer
    if (breakTimerState.activeTaskId) {
      startTimer(breakTimerState.activeTaskId);
      // Record user action (resets prolonged navigation timer)
      recordUserAction();
    }
    // Record that break was completed (reset counter)
    recordBreakComplete();
  }, [stopBreak, breakTimerState.activeTaskId, startTimer, recordBreakComplete, recordUserAction]);

  const handleEndFocus = useCallback(async () => {
    // Return task to To Do when focus is stopped
    if (breakTimerState.activeTaskId) {
      try {
        // Update task status to To Do (0) - automatically syncs with Firestore and updates UI
        await updateTaskStatus(breakTimerState.activeTaskId, 0);
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
    // Stop break timer and focus timer
    stopBreak();
    stopTimer();
    // Record that focus was ended (reset counter - cycle was interrupted)
    recordTaskFinished();
  }, [stopBreak, stopTimer, breakTimerState.activeTaskId, updateTaskStatus, recordTaskFinished]);

  const handleCloseBreakDialog = useCallback(() => {
    setShowBreakCompleteDialog(false);
  }, []);

  // Get durations in minutes
  const breakDuration = useMemo(() => settings.shortBreakDuration || 5, [settings.shortBreakDuration]);
  const focusDuration = useMemo(() => settings.focusDuration || 25, [settings.focusDuration]);

  return (
    <BreakSessionCompleteDialog
      isOpen={showBreakCompleteDialog}
      onClose={handleCloseBreakDialog}
      breakDuration={breakDuration}
      focusDuration={focusDuration}
      onStartFocus={handleStartFocus}
      onEndFocus={handleEndFocus}
    />
  );
}

BreakSessionCompleteDialogWrapper.displayName = "BreakSessionCompleteDialogWrapper";
