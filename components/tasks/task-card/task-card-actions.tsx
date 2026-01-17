"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import type { TaskCardActionsProps } from "@/models/task-card-props";
import { cn } from "@/utils/ui";
import { TaskCardEditActions } from "./task-card-edit-actions";
import { TaskCardFocusActions } from "./task-card-focus-actions";
import { styles } from "./task-card-styles";

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