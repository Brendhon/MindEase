"use client";

import { useBreakTimer } from "@/contexts/break-timer-context";
import { useFocusTimer } from "@/contexts/focus-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BreakSessionCompleteDialog } from "./break-session-complete-dialog";

/**
 * BreakSessionCompleteDialogWrapper Component - MindEase
 * Global wrapper for the break session complete dialog
 * Monitors break timer state and shows dialog when break timer completes
 */
export function BreakSessionCompleteDialogWrapper() {
  const { breakTimerState, stopBreak } = useBreakTimer();
  const { timerState, startTimer, stopTimer } = useFocusTimer();
  const { settings } = useCognitiveSettings();

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
    }
  }, [stopBreak, breakTimerState.activeTaskId, startTimer]);

  const handleEndFocus = useCallback(() => {
    // Stop break timer and focus timer
    stopBreak();
    stopTimer();
  }, [stopBreak, stopTimer]);

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
