"use client";

import { CardContent } from "@/components/ui/card/card-content";
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
  
  /** Whether the timer is paused */
  isPaused: boolean;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * TaskCardTimer Component - MindEase
 * Displays timer indicator when focus session is active
 */
export function TaskCardTimer({
  task,
  isActive,
  isRunning,
  isPaused,
  "data-testid": testId,
}: TaskCardTimerProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();
  const { timerState, formatTime } = useFocusTimer();

  if (!isActive || (!isRunning && !isPaused)) {
    return null;
  }

  return (
    <div
      className={cn(
        styles.timerIndicator,
        isPaused && styles.timerIndicatorPaused
      )}
      data-testid={testId || `task-card-timer-${task.id}`}
    >
      <p className={cn(styles.timerLabel, fontSizeClasses.sm)}>
        {textDetail.getText("tasks_focus_time_remaining")}:
      </p>
      <p className={cn(styles.timerValue, fontSizeClasses.base)}>
        {formatTime(timerState.remainingTime)}
      </p>
      {isRunning && (
        <p className={cn(styles.timerStatus, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_focus_session_active")}
        </p>
      )}
      {isPaused && (
        <p className={cn(styles.timerStatus, styles.timerStatusPaused, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_action_paused")}
        </p>
      )}
    </div>
  );
}

TaskCardTimer.displayName = "TaskCardTimer";

const styles = {
  timerIndicator: "flex flex-col gap-1 mb-4 p-3 bg-action-primary/5 rounded-lg border border-action-primary/20",
  timerIndicatorPaused: "bg-action-info/5 border-action-info/20",
  timerLabel: "text-text-secondary",
  timerValue: "font-semibold text-action-primary",
  timerStatus: "text-text-secondary italic",
  timerStatusPaused: "text-action-info",
} as const;
