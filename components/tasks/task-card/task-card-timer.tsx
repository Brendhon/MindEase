"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useBreakTimer } from "@/hooks/useBreakTimer";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { Task } from "@/models/Task";
import { formatTime } from "@/utils/timer";
import { cn } from "@/utils/ui";

export interface TaskCardTimerProps {
  /** Task data */
  task: Task;

  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * TaskCardTimer Component - MindEase
 * Displays timer indicator when focus session is active or break timer is running
 */
export function TaskCardTimer({ task, "data-testid": testId }: TaskCardTimerProps) {
  const { id } = task;
  const { fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();
  const { remainingTime: focusRemainingTime, isRunning: isFocusRunning } = useFocusTimer();
  const { remainingTime: breakRemainingTime, isRunning: isBreakRunning } = useBreakTimer();

  // Show focus timer when active and running
  if (isFocusRunning(id)) {
    return (
      <div
        className={cn(styles.timerIndicator, styles.focusTimer)}
        data-testid={testId || `task-card-timer-${id}`}
      >
        <p className={cn(styles.timerLabel, fontSizeClasses.sm)}>
          {getText("tasks_focus_time_remaining")}:
        </p>
        <p className={cn(styles.timerValue, styles.focusTimerValue, fontSizeClasses.base)}>
          {formatTime(focusRemainingTime)}
        </p>
        <p className={cn(styles.timerStatus, fontSizeClasses.sm)}>
          {getText("tasks_focus_session_active")}
        </p>
      </div>
    );
  }

  // Show break timer when break is running (regardless of task)
  if (isBreakRunning(id)) {
    return (
      <div
        className={cn(styles.timerIndicator, styles.breakTimer)}
        data-testid={testId ? `${testId}-break-timer` : `task-card-break-timer-${id}`}
      >
        <p className={cn(styles.timerLabel, fontSizeClasses.sm)}>
          {getText("tasks_break_time_remaining")}:
        </p>
        <p className={cn(styles.timerValue, styles.breakTimerValue, fontSizeClasses.base)}>
          {formatTime(breakRemainingTime)}
        </p>
        <p className={cn(styles.timerStatus, fontSizeClasses.sm)}>
          {getText("tasks_break_session_active")}
        </p>
      </div>
    );
  }

  return null;
}

TaskCardTimer.displayName = "TaskCardTimer";

const styles = {
  timerIndicator: "flex flex-col gap-1 mb-4 p-3 rounded-lg border",
  focusTimer: "bg-action-primary/5 border-action-primary/20",
  breakTimer: "bg-action-secondary/5 border-action-secondary/20",
  timerLabel: "text-text-secondary",
  timerValue: "font-semibold",
  focusTimerValue: "text-action-primary",
  breakTimerValue: "text-action-secondary",
  timerStatus: "text-text-secondary italic",
} as const;
