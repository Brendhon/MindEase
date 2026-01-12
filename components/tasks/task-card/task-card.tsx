"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card/card-content";
import { useFocusTimer } from "@/contexts/focus-timer-context";
import { cn } from "@/utils/ui";
import type { Task } from "@/models/Task";
import { TaskChecklist } from "../task-checklist";
import { TaskCardHeader } from "./task-card-header";
import { TaskCardTimer } from "./task-card-timer";
import { TaskCardActions } from "./task-card-actions";

/**
 * TaskCard Component - MindEase
 * Individual task card with actions and status
 */
export interface TaskCardProps {
  /** Task data */
  task: Task;
  
  /** Callback when task is edited */
  onEdit?: (task: Task) => void;
  
  /** Callback when task is deleted */
  onDelete?: (taskId: string) => void;
  
  /** Callback when task status changes */
  onStatusChange?: (taskId: string, status: number) => void;
  
  /** Callback when subtask is toggled */
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  "data-testid": testId,
}: TaskCardProps) {
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer } = useFocusTimer();

  const isActive = timerState.activeTaskId === task.id;
  const isRunning = isActive && timerState.timerState === "running";
  const isPaused = isActive && timerState.timerState === "paused";

  // Handle focus actions
  const handleStartFocus = () => {
    if (task.subtasks && task.subtasks.length > 0) {
      // If task has subtasks, start with first incomplete one or first one
      const firstIncomplete = task.subtasks.find((st) => !st.completed);
      const subtaskId = firstIncomplete?.id || task.subtasks[0]?.id;
      startTimer(task.id, subtaskId);
    } else {
      startTimer(task.id);
    }
    onStatusChange?.(task.id, 1); // Set to In Progress
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleStop = () => {
    stopTimer();
  };

  const handleComplete = () => {
    stopTimer();
    onStatusChange?.(task.id, 2); // Set to Done
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    onToggleSubtask?.(task.id, subtaskId);
  };

  // Card classes based on status and focus state
  const cardClasses = useMemo(() => {
    switch (true) {
      case task.status === 2:
        return styles.cardDone;
      case isActive:
        return styles.cardActive;
      default:
        return styles.cardDefault;
    }
  }, [task.status, isActive]);

  // Determine which actions to show
  const showActions = task.status !== 2; // Don't show actions for completed tasks

  return (
    <Card className={cardClasses} focused={isActive} data-testid={testId || `task-card-${task.id}`}>
      <TaskCardHeader task={task} data-testid={testId} />

      <CardContent>
        <TaskCardTimer
          task={task}
          isActive={isActive}
          isRunning={isRunning}
          isPaused={isPaused}
          data-testid={testId}
        />

        {/* Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <TaskChecklist
            subtasks={task.subtasks}
            focusedSubtaskId={isActive ? timerState.focusedSubtaskId : null}
            onToggleSubtask={showActions ? handleToggleSubtask : undefined}
            interactive={showActions}
            data-testid={`task-card-checklist-${task.id}`}
          />
        )}

        <TaskCardActions
          task={task}
          isActive={isActive}
          isRunning={isRunning}
          isPaused={isPaused}
          onStartFocus={handleStartFocus}
          onPause={handlePause}
          onResume={handleResume}
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

const styles = {
  cardDefault: "m-1",
  cardActive: "m-1 ring-2 ring-action-primary",
  cardDone: "m-1 opacity-60",
} as const;
