"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTextDetail } from "@/hooks/useTextDetail";
import { Task } from "@/models/Task";
import { cn } from "@/utils/ui";
import { AlertTriangle, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/**
 * DashboardCognitiveAlerts Component - MindEase
 * Display cognitive alerts based on task focus time
 * 
 * Alerts:
 * - Long task focus time warning (e.g., "Você está muito tempo nesta tarefa")
 */
export interface DashboardCognitiveAlertsProps {
  /** Array of tasks to check for alerts */
  tasks: Task[];
  
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Alert threshold in minutes
 * Show alert if user has been focused on a task for more than this time
 */
const LONG_TASK_ALERT_THRESHOLD_MINUTES = 60; // 1 hour

export function DashboardCognitiveAlerts({ tasks, "data-testid": testId }: DashboardCognitiveAlertsProps) {
  const { getText } = useTextDetail();
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses(); 
  const { timerState } = useFocusTimer();
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);

  // Calculate elapsed time for active task
  useEffect(() => {
    if (!timerState.startTime || timerState.timerState !== "running") {
      setElapsedMinutes(0);
      return;
    }

    // Calculate elapsed time in minutes
    const calculateElapsed = () => {
      const now = new Date();
      const start = new Date(timerState.startTime!);
      const diffMs = now.getTime() - start.getTime();
      return Math.floor(diffMs / 60000); // Convert to minutes
    };

    // Set initial value immediately
    setElapsedMinutes(calculateElapsed());

    // Update every 30 seconds for better UX (but display in minutes)
    const interval = setInterval(() => {
      setElapsedMinutes(calculateElapsed());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timerState.startTime, timerState.timerState]);

  // Get active task
  const activeTask = useMemo(() => {
    if (!timerState.activeTaskId) return null;
    return tasks.find((task) => task.id === timerState.activeTaskId) || null;
  }, [tasks, timerState.activeTaskId]);

  // Check if we should show long task alert
  const showLongTaskAlert = useMemo(() => {
    return (
      timerState.timerState === "running" &&
      activeTask !== null &&
      elapsedMinutes >= LONG_TASK_ALERT_THRESHOLD_MINUTES
    );
  }, [timerState.timerState, activeTask, elapsedMinutes]);

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const alertClasses = useMemo(
    () => cn(styles.alert, spacingClasses.padding),
    [spacingClasses.padding]
  );

  const alertTitleClasses = useMemo(
    () => cn(styles.alertTitle, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const alertMessageClasses = useMemo(
    () => cn(styles.alertMessage, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  if (!showLongTaskAlert) {
    return null;
  }

  return (
    <div className={containerClasses} data-testid={testId || "dashboard-cognitive-alerts"}>
      <div className={alertClasses} role="alert">
        <div className={styles.alertHeader}>
          <AlertTriangle className={styles.alertIcon} size={20} />
          <h3 className={alertTitleClasses}>
            {getText("dashboard_alert_long_task_title")}
          </h3>
        </div>
        <p className={alertMessageClasses}>
          {getText("dashboard_alert_long_task_message")}
          {activeTask?.title && (
            <span className={styles.taskTitle}> "{activeTask.title}"</span>
          )}
        </p>
        <div className={styles.alertTime}>
          <Clock className={styles.timeIcon} size={16} />
          <span className={cn(styles.timeText, fontSizeClasses.sm)}>
            {elapsedMinutes} {getText("dashboard_alert_minutes")}
          </span>
        </div>
      </div>
    </div>
  );
}

DashboardCognitiveAlerts.displayName = "DashboardCognitiveAlerts";

/**
 * DashboardCognitiveAlerts Styles - MindEase
 * Centralized styles for dashboard cognitive alerts component
 */

export const styles = {
  container: "flex flex-col w-full",
  alert: "flex flex-col bg-action-warning/10 border border-action-warning rounded-lg gap-2",
  alertHeader: "flex items-center gap-2",
  alertIcon: "text-action-warning flex-shrink-0",
  alertTitle: "font-semibold text-action-warning",
  alertMessage: "text-text-secondary",
  alertTime: "flex items-center gap-2 mt-1",
  timeIcon: "text-text-secondary",
  timeText: "text-text-secondary",
  taskTitle: "font-semibold text-text-primary",
} as const;
