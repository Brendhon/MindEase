"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import type { Task } from "@/models/Task";
import { cn } from "@/utils/ui";
import { TaskCardEditActions } from "./task-card-edit-actions";
import { TaskCardFocusActions } from "./task-card-focus-actions";
import { styles } from "./task-card-styles";

export interface TaskCardActionsProps {
  /** Task data */
  task: Task;
  
  /** Whether the timer is active for this task */
  isActive: boolean;
  
  /** Whether the timer is running */
  isRunning: boolean;
  
  /** Whether there is already an active task (to disable start button) */
  hasActiveTask: boolean;
  
  /** Whether the break timer is running for this task */
  isBreakRunning?: boolean;
  
  /** Callback to start focus session */
  onStartFocus: () => void;
  
  /** Callback to stop timer (ends focus and returns task to To Do) */
  onStop: () => void;
  
  /** Callback to complete task (marks as done and stops timer) */
  onComplete: () => void;
  
  /** Callback when task is edited */
  onEdit: () => void;
  
  /** Callback when task is deleted */
  onDelete: () => void;
  
  /** Test ID prefix for testing */
  "data-testid"?: string;
}

/**
 * TaskCardActions Component - MindEase
 * Container for all task action buttons
 */
export function TaskCardActions({
  task,
  isActive,
  isRunning,
  hasActiveTask,
  isBreakRunning = false,
  onStartFocus,
  onStop,
  onComplete,
  onEdit,
  onDelete,
  "data-testid": testId,
}: TaskCardActionsProps) {
  const { spacingClasses } = useAccessibilityClasses();

  // Don't show actions for completed tasks
  if (task.status === 2) {
    return null;
  }

  return (
    <div className={cn(styles.actions, spacingClasses.gap)}>
      <TaskCardFocusActions
        task={task}
        isRunning={isRunning}
        hasActiveTask={hasActiveTask}
        isBreakRunning={isBreakRunning}
        onStartFocus={onStartFocus}
        onStop={onStop}
        onComplete={onComplete}
        data-testid={testId}
      />
      {/* Don't show edit actions during break */}
      {!isActive && !isBreakRunning && (
        <TaskCardEditActions
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          data-testid={testId}
        />
      )}
    </div>
  );
}

TaskCardActions.displayName = "TaskCardActions";