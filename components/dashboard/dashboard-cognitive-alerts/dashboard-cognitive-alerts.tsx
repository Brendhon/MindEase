"use client";

import { useBreakTimer } from "@/hooks/useBreakTimer";
import { useCognitiveAlerts } from "@/hooks/useCognitiveAlerts";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/models/Task";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { CognitiveAlertExcessiveTime } from "./cognitive-alert-excessive-time";
import { CognitiveAlertMissingBreak } from "./cognitive-alert-missing-break";
import { CognitiveAlertProlongedNavigation } from "./cognitive-alert-prolonged-navigation";
import {
  EXCESSIVE_TIME_THRESHOLD_MS,
  MISSING_BREAK_SESSIONS_THRESHOLD,
  PROLONGED_NAVIGATION_THRESHOLD_MS,
} from "./cognitive-alerts-constants";

/**
 * DashboardCognitiveAlerts Component - MindEase
 * Display cognitive alerts based on task focus time, break patterns, and navigation behavior
 * 
 * Alerts:
 * - Excessive time: Same task in focus for >60-90 min
 * - Missing break: Multiple focus sessions without break
 * - Prolonged navigation: Navigating without actions for extended time
 * 
 * Priority: excessive_time > missing_break > prolonged_navigation
 */
export interface DashboardCognitiveAlertsProps {
  /** Array of tasks to check for alerts */
  tasks: Task[];
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function DashboardCognitiveAlerts({ tasks, "data-testid": testId }: DashboardCognitiveAlertsProps) {
  const { timerState, isRunning } = useFocusTimer();
  const { isRunning: isBreakRunning } = useBreakTimer();
  const { settings } = useCognitiveSettings();
  const { getTask } = useTasks();
  const {
    state,
    showAlert,
    dismissAlert,
    incrementSessions,
    resetSessions,
    startNavigation,
    stopNavigation,
    startTaskFocus,
    stopTaskFocus,
    updateUserAction,
    shouldShowAlert,
    getTaskFocusTime,
    getNavigationTime,
  } = useCognitiveAlerts();

  // Track previous timer state to detect session completions
  const prevTimerStateRef = useRef(timerState);
  const prevBreakRunningRef = useRef(false);

  // Monitor focus timer state changes
  useEffect(() => {
    const prev = prevTimerStateRef.current;
    const current = timerState;
    const activeTaskId = current.activeTaskId;

    // Start tracking focus time when timer starts
    if (activeTaskId && isRunning(activeTaskId) && !prev.activeTaskId) {
      startTaskFocus(activeTaskId);
      updateUserAction(); // User started focus = action
    }

    // Stop tracking focus time when timer stops
    if (prev.activeTaskId && !isRunning(activeTaskId ?? undefined)) {
      stopTaskFocus(prev.activeTaskId);
      updateUserAction(); // User stopped focus = action
    }

    // Detect session completion (timer completed)
    if (
      prev.timerState === "running" &&
      current.timerState === "idle" &&
      current.activeTaskId !== null &&
      prev.activeTaskId === current.activeTaskId
    ) {
      // Session completed - increment counter
      incrementSessions();
      updateUserAction();
    }

    prevTimerStateRef.current = current;
  }, [timerState, isRunning, startTaskFocus, stopTaskFocus, incrementSessions, updateUserAction]);

  // Monitor break timer to reset session counter when break is taken
  useEffect(() => {
    const wasBreakRunning = prevBreakRunningRef.current;
    const isBreakRunningNow = isBreakRunning();

    // If break started, reset consecutive sessions counter
    if (!wasBreakRunning && isBreakRunningNow) {
      resetSessions();
      updateUserAction(); // User started break = action
    }

    prevBreakRunningRef.current = isBreakRunningNow;
  }, [isBreakRunning, resetSessions, updateUserAction]);

  // Monitor navigation time (when user is not performing actions)
  useEffect(() => {
    // Start navigation tracking if no timer is active
    const hasActiveTimer = isRunning() || isBreakRunning();
    
    if (!hasActiveTimer && !state.navigationStartTime) {
      startNavigation();
    } else if (hasActiveTimer && state.navigationStartTime) {
      stopNavigation();
    }
  }, [isRunning, isBreakRunning, state.navigationStartTime, startNavigation, stopNavigation]);

  // Check for excessive time alert
  const excessiveTimeAlert = useMemo(() => {
    if (!timerState.activeTaskId || !isRunning(timerState.activeTaskId)) {
      return null;
    }

    const focusTime = getTaskFocusTime(timerState.activeTaskId);
    const task = getTask(timerState.activeTaskId);

    if (focusTime >= EXCESSIVE_TIME_THRESHOLD_MS && shouldShowAlert("excessive_time")) {
      return {
        type: "excessive_time" as const,
        taskName: task?.title,
        elapsedTime: focusTime,
      };
    }

    return null;
  }, [timerState.activeTaskId, isRunning, getTaskFocusTime, getTask, shouldShowAlert]);

  // Check for missing break alert
  const missingBreakAlert = useMemo(() => {
    if (state.consecutiveSessions >= MISSING_BREAK_SESSIONS_THRESHOLD && shouldShowAlert("missing_break")) {
      return {
        type: "missing_break" as const,
        sessionsCount: state.consecutiveSessions,
      };
    }
    return null;
  }, [state.consecutiveSessions, shouldShowAlert]);

  // Check for prolonged navigation alert
  const prolongedNavigationAlert = useMemo(() => {
    const navigationTime = getNavigationTime();
    const hasActiveTimer = isRunning() || isBreakRunning();

    if (
      !hasActiveTimer &&
      navigationTime >= PROLONGED_NAVIGATION_THRESHOLD_MS &&
      shouldShowAlert("prolonged_navigation")
    ) {
      return {
        type: "prolonged_navigation" as const,
        navigationTime,
      };
    }
    return null;
  }, [getNavigationTime, isRunning, isBreakRunning, shouldShowAlert]);

  // Determine which alert to show (priority order)
  const activeAlert = useMemo(() => {
    if (excessiveTimeAlert) return excessiveTimeAlert;
    if (missingBreakAlert) return missingBreakAlert;
    if (prolongedNavigationAlert) return prolongedNavigationAlert;
    return null;
  }, [excessiveTimeAlert, missingBreakAlert, prolongedNavigationAlert]);

  // Handle alert dismissal
  const handleDismiss = useCallback(
    (alertType: "excessive_time" | "missing_break" | "prolonged_navigation") => {
      dismissAlert(alertType);
    },
    [dismissAlert]
  );

  // Show alert when conditions are met
  useEffect(() => {
    if (activeAlert) {
      showAlert(activeAlert.type);
    }
  }, [activeAlert, showAlert]);

  // Track user actions (clicks, keyboard, etc.) to reset navigation tracking
  useEffect(() => {
    const handleUserAction = () => {
      updateUserAction();
    };

    // Listen to common user interaction events
    window.addEventListener("click", handleUserAction, true);
    window.addEventListener("keydown", handleUserAction, true);
    window.addEventListener("focus", handleUserAction, true);

    return () => {
      window.removeEventListener("click", handleUserAction, true);
      window.removeEventListener("keydown", handleUserAction, true);
      window.removeEventListener("focus", handleUserAction, true);
    };
  }, [updateUserAction]);

  return (
    <div data-testid={testId || "dashboard-cognitive-alerts"}>
      {activeAlert?.type === "excessive_time" && (
        <CognitiveAlertExcessiveTime
          isVisible={state.alertHistory.includes("excessive_time")}
          taskName={activeAlert.taskName}
          elapsedTime={activeAlert.elapsedTime}
          onDismiss={() => handleDismiss("excessive_time")}
          data-testid={testId ? `${testId}-excessive-time` : "cognitive-alert-excessive-time"}
        />
      )}

      {activeAlert?.type === "missing_break" && (
        <CognitiveAlertMissingBreak
          isVisible={state.alertHistory.includes("missing_break")}
          sessionsCount={activeAlert.sessionsCount}
          onDismiss={() => handleDismiss("missing_break")}
          data-testid={testId ? `${testId}-missing-break` : "cognitive-alert-missing-break"}
        />
      )}

      {activeAlert?.type === "prolonged_navigation" && (
        <CognitiveAlertProlongedNavigation
          isVisible={state.alertHistory.includes("prolonged_navigation")}
          navigationTime={activeAlert.navigationTime}
          onDismiss={() => handleDismiss("prolonged_navigation")}
          data-testid={testId ? `${testId}-prolonged-navigation` : "cognitive-alert-prolonged-navigation"}
        />
      )}
    </div>
  );
}

DashboardCognitiveAlerts.displayName = "DashboardCognitiveAlerts";
