"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useBreakTimer, useFocusTimer } from "@/hooks/timer";
import { useTextDetail } from "@/hooks/accessibility";
import type { TaskCardTimerProps } from "@/models/task-card-props";
import { formatTime } from "@/utils/timer";
import { cn } from "@/utils/ui";
import { styles } from "./task-card-styles";

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