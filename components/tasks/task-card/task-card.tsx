"use client";

import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card/card-content";
import { useTaskCard } from "@/hooks/tasks";
import type { TaskCardProps } from "@/models/task-card-props";
import { TaskChecklist } from "../task-checklist";
import { TaskCardActions } from "./task-card-actions";
import { TaskCardHeader } from "./task-card-header";
import { TaskCardTimer } from "./task-card-timer";

/**
 * TaskCard Component - MindEase
 * Individual task card with actions and status
 */

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  "data-testid": testId,
}: TaskCardProps) {
  const {
    cardClasses,
    isActive,
    isRunning,
    hasActiveTask,
    isBreakRunning,
    isFocused,
    isChecklistInteractive,
    handleStartFocus,
    handleStop,
    handleComplete,
    handleEdit,
    handleDelete,
    handleToggleSubtask,
  } = useTaskCard({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    onToggleSubtask,
    testId,
  });

  // Determine which actions to show
  const showActions = task.status !== 2; // Don't show actions for completed tasks

  return (
    <Card
      className={cardClasses}
      focused={isFocused}
      data-testid={testId || `task-card-${task.id}`}
    >
      <TaskCardHeader task={task} data-testid={testId} />

      <CardContent>
        <TaskCardTimer task={task} data-testid={testId} />

        {/* Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <TaskChecklist
            subtasks={task.subtasks}
            onToggleSubtask={showActions ? handleToggleSubtask : undefined}
            interactive={isChecklistInteractive}
            isInFocus={isChecklistInteractive}
            data-testid={`task-card-checklist-${task.id}`}
          />
        )}

        <TaskCardActions
          task={task}
          isActive={isActive}
          isRunning={isRunning}
          hasActiveTask={hasActiveTask}
          isBreakRunning={isBreakRunning}
          onStartFocus={handleStartFocus}
          onStop={handleStop}
          onComplete={handleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          data-testid={testId}
        />
      </CardContent>
    </Card>
  );
}

TaskCard.displayName = "TaskCard";
