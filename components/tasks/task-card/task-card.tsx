"use client";

import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card/card-content";
import { useBreakTimer } from "@/contexts/break-timer-context";
import { useFocusTimer } from "@/contexts/focus-timer-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useDialog } from "@/hooks/useDialog";
import type { Subtask, Task } from "@/models/Task";
import { canCompleteTask, getPendingSubtasks } from "@/utils/tasks";
import { useCallback, useMemo } from "react";
import { TaskChecklist } from "../task-checklist";
import { TaskCardActions } from "./task-card-actions";
import { TaskCardHeader } from "./task-card-header";
import { TaskCardTimer } from "./task-card-timer";

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
  const { timerState, startTimer, stopTimer } = useFocusTimer();
  const { breakTimerState, stopBreak } = useBreakTimer();
  const { openDialog } = useDialog();
  const { textDetail } = useCognitiveSettings();

  const isActive = timerState.activeTaskId === task.id;
  const isRunning = isActive && timerState.timerState === "running";
  const isBreakActive = breakTimerState.activeTaskId === task.id;
  const isBreakRunning = isBreakActive && breakTimerState.breakTimerState === "running";
  const hasActiveTask = !!timerState.activeTaskId || !!breakTimerState.activeTaskId;
  
  // Check if task has pending subtasks (using centralized utility)
  const hasPendingSubtasks = useMemo(() => {
    return !canCompleteTask(task);
  }, [task]);

  // Get pending subtasks (using centralized utility)
  const pendingSubtasks = useMemo(() => {
    return getPendingSubtasks(task);
  }, [task]);

  // Handle focus actions
  const handleStartFocus = () => {
    startTimer(task.id);
    onStatusChange?.(task.id, 1); // Set to In Progress
  };

  const handleStop = () => {
    // Stop both focus timer and break timer if break is active
    if (isBreakActive && isBreakRunning) {
      stopBreak();
    }
    stopTimer();
    // Return task to To Do when focus is stopped
    onStatusChange?.(task.id, 0);
  };

  // Dialog for complete pending subtasks
  const completePendingSubtasksDialog = useCallback((pendingList: React.ReactNode) => {
    openDialog({
      titleKey: "tasks_complete_pending_title",
      descriptionKey: "tasks_complete_pending_message",
      info: (
        <>
          {pendingList}
          <p className={styles.completePendingSubtasksDialogHint}>
            {textDetail.getText("tasks_complete_pending_hint")}
          </p>
        </>
      ),
      confirmLabelKey: "tasks_complete_pending_button",
      "data-testid": testId ? `${testId}-pending-dialog` : "task-pending-subtasks-dialog",
    });
  }, [openDialog]);

  const handleComplete = () => {
    // Check if task has pending subtasks
    if (hasPendingSubtasks) {
      const pendingList = (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-text-primary text-sm">
            {textDetail.getText("tasks_complete_pending_list_label")}
          </p>
          <ul className="flex flex-col gap-1 pl-4">
            {pendingSubtasks.map((subtask) => (
              <li key={subtask.id} className="text-text-secondary text-sm">
                • {subtask.title}
              </li>
            ))}
          </ul>
        </div>
      );

      completePendingSubtasksDialog(pendingList);
    } else {
      stopTimer();
      onStatusChange?.(task.id, 2);
    }
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  // Dialog for subtask focus required
  const subtaskFocusRequiredDialog = useCallback(() => {
    openDialog({
      titleKey: "tasks_subtask_focus_required_title",
      descriptionKey: "tasks_subtask_focus_required_message",
      info: (
        <p className={styles.subtaskFocusRequiredDialog}>
          {textDetail.getText("tasks_subtask_focus_required_hint")}
        </p>
      ),
      cancelLabelKey: "tasks_subtask_focus_required_cancel",
      confirmLabelKey: "tasks_subtask_focus_required_button",
      onCancel: () => {},
      onConfirm: () => {
        handleStartFocus();
      },
      "data-testid": testId ? `${testId}-focus-required-dialog` : "task-focus-required-dialog",
    });
  }, [openDialog]);

  const subtaskBreakRequiredDialog = useCallback(() => {
    openDialog({
      titleKey: "tasks_subtask_break_required_title",
      descriptionKey: "tasks_subtask_break_required_message",
      cancelLabelKey: "tasks_subtask_break_required_cancel",
      onCancel: () => {},
    });
  }, [openDialog]);

  const handleToggleSubtask = (subtaskId: string) => {
    if (isBreakActive && isBreakRunning) {
      subtaskBreakRequiredDialog();
      return;
    }
    
    // Only allow toggling subtasks when task is in focus
    if (!isActive || !isRunning) {
      subtaskFocusRequiredDialog();
      return;
    }

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
          isActive={isActive || isBreakActive}
          isRunning={isRunning}
          isBreakRunning={isBreakRunning}
          data-testid={testId}
        />

        {/* Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <TaskChecklist
            subtasks={task.subtasks}
            onToggleSubtask={showActions ? handleToggleSubtask : undefined}
            interactive={isActive && isRunning}
            isInFocus={isActive && isRunning}
            data-testid={`task-card-checklist-${task.id}`}
          />
        )}

        <TaskCardActions
          task={task}
          isActive={isActive}
          isRunning={isRunning}
          hasActiveTask={hasActiveTask}
          isBreakRunning={isBreakActive && isBreakRunning}
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

const styles = {
  cardDefault: "m-1",
  cardActive: "m-1 ring-2 ring-action-primary",
  cardDone: "m-1 opacity-60",
  subtaskFocusRequiredDialog: "text-text-secondary italic text-sm",
  completePendingSubtasksDialogHint: "text-text-secondary italic text-sm mt-2",
} as const;
