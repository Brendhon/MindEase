"use client";

import { CardContent } from "@/components/ui/card/card-content";
import { useBreakTimer } from "@/contexts/break-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFocusTimer } from "@/contexts/focus-timer-context";
import { cn } from "@/utils/ui";
import type { Task } from "@/models/Task";

export interface TaskCardTimerProps {
  /** Task data */
  task: Task;
  
  /** Whether the timer is active for this task */
  isActive: boolean;
  
  /** Whether the timer is running */
  isRunning: boolean;
  
  /** Whether the break timer is running */
  isBreakRunning: boolean;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * TaskCardTimer Component - MindEase
 * Displays timer indicator when focus session is active or break timer is running
 */
export function TaskCardTimer({
  task,
  isActive,
  isRunning,
  isBreakRunning,
  "data-testid": testId,
}: TaskCardTimerProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();
  const { timerState, formatTime } = useFocusTimer();
  const { breakTimerState, formatTime: formatBreakTime } = useBreakTimer();

  // Show focus timer when active and running
  if (isActive && isRunning) {
    return (
      <div
        className={cn(styles.timerIndicator, styles.focusTimer)}
        data-testid={testId || `task-card-timer-${task.id}`}
      >
        <p className={cn(styles.timerLabel, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_focus_time_remaining")}:
        </p>
        <p className={cn(styles.timerValue, styles.focusTimerValue, fontSizeClasses.base)}>
          {formatTime(timerState.remainingTime)}
        </p>
        <p className={cn(styles.timerStatus, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_focus_session_active")}
        </p>
      </div>
    );
  }

  // Show break timer when break is running (regardless of task)
  if (isActive && isBreakRunning) {
    return (
      <div
        className={cn(styles.timerIndicator, styles.breakTimer)}
        data-testid={testId ? `${testId}-break-timer` : `task-card-break-timer-${task.id}`}
      >
        <p className={cn(styles.timerLabel, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_break_time_remaining")}:
        </p>
        <p className={cn(styles.timerValue, styles.breakTimerValue, fontSizeClasses.base)}>
          {formatBreakTime(breakTimerState.remainingTime)}
        </p>
        <p className={cn(styles.timerStatus, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_break_session_active")}
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
