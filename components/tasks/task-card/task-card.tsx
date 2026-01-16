"use client";

import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card/card-content";
import { useBreakTimer } from "@/hooks/useBreakTimer";
import { useDialog } from "@/hooks/useDialog";
import { useFeedback } from "@/hooks/useFeedback";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTasks } from "@/hooks/useTasks";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { Task } from "@/models/Task";
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
  const { startTimer, stopTimer, isActive: isFocusActive, isRunning: isFocusRunning, hasActiveTask: hasFocusActiveTask } = useFocusTimer();
  const { stopBreak, isActive: isBreakActive, isRunning: isBreakRunning, hasActiveTask: hasBreakActiveTask } = useBreakTimer();
  const { openDialog } = useDialog();
  const { getText } = useTextDetail();
  const { success } = useFeedback();
  const { hasTasksInProgress } = useTasks();

  const hasActiveTask = hasTasksInProgress(task.id);

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
    stopBreak();
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
            {getText("tasks_complete_pending_hint")}
          </p>
        </>
      ),
      confirmLabelKey: "button_ok",
      "data-testid": testId ? `${testId}-pending-dialog` : "task-pending-subtasks-dialog",
    });
  }, [openDialog]);

  const handleComplete = () => {
    // Check if task has pending subtasks
    if (hasPendingSubtasks) {
      const pendingList = (
        <div className={styles.pendingSubtasksContainer}>
          <p className={styles.pendingSubtasksLabel}>
            {getText("tasks_complete_pending_list_label")}
          </p>
          <ul className={styles.pendingSubtasksList}>
            {pendingSubtasks.map((subtask) => (
              <li key={subtask.id} className={styles.pendingSubtasksItem}>
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
          {getText("tasks_subtask_focus_required_hint")}
        </p>
      ),
      cancelLabelKey: "tasks_subtask_focus_required_cancel",
      confirmLabelKey: "tasks_subtask_focus_required_button",
      onCancel: () => { },
      onConfirm: hasActiveTask ? undefined : () => handleStartFocus(),
      "data-testid": testId ? `${testId}-focus-required-dialog` : "task-focus-required-dialog",
    });
  }, [openDialog]);

  const subtaskBreakRequiredDialog = useCallback(() => {
    openDialog({
      titleKey: "tasks_subtask_break_required_title",
      descriptionKey: "tasks_subtask_break_required_message",
      cancelLabelKey: "button_cancel",
      onCancel: () => { },
    });
  }, [openDialog]);

  const handleToggleSubtask = (subtaskId: string) => {
    if (isBreakActive(task.id) && isBreakRunning(task.id)) {
      subtaskBreakRequiredDialog();
      return;
    }

    // Only allow toggling subtasks when task is in focus
    if (!isFocusActive(task.id) || !isFocusRunning(task.id)) {
      subtaskFocusRequiredDialog();
      return;
    }

    // Find the subtask to determine its current state
    const subtask = task.subtasks?.find((st) => st.id === subtaskId);
    const wasCompleted = subtask?.completed ?? false;

    onToggleSubtask?.(task.id, subtaskId);

    // Show feedback based on new state (opposite of current state)
    if (wasCompleted) {
      success("tasks_checklist_step_pending");
    } else {
      success("tasks_checklist_step_completed");
    }
  };

  // Card classes based on status and focus state
  const cardClasses = useMemo(() => {
    switch (true) {
      case task.status === 2:
        return styles.cardDone;
      case isFocusActive(task.id):
        return styles.cardActive;
      default:
        return styles.cardDefault;
    }
  }, [task, isFocusActive]);

  // Determine which actions to show
  const showActions = task.status !== 2; // Don't show actions for completed tasks

  return (
    <Card className={cardClasses} focused={isFocusActive(task.id) || isBreakActive(task.id)} data-testid={testId || `task-card-${task.id}`}>
      <TaskCardHeader task={task} data-testid={testId} />

      <CardContent>
        <TaskCardTimer task={task} data-testid={testId} />

        {/* Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <TaskChecklist
            subtasks={task.subtasks}
            onToggleSubtask={showActions ? handleToggleSubtask : undefined}
            interactive={isFocusActive(task.id) && isFocusRunning(task.id)}
            isInFocus={isFocusActive(task.id) && isFocusRunning(task.id)}
            data-testid={`task-card-checklist-${task.id}`}
          />
        )}

        <TaskCardActions
          task={task}
          isActive={isFocusActive(task.id)}
          isRunning={isFocusRunning(task.id)}
          hasActiveTask={hasActiveTask}
          isBreakRunning={isBreakActive(task.id) && isBreakRunning(task.id)}
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
  pendingSubtasksContainer: "flex flex-col gap-2",
  pendingSubtasksLabel: "font-medium text-text-primary text-sm",
  pendingSubtasksList: "flex flex-col gap-1 pl-4",
  pendingSubtasksItem: "text-text-secondary text-sm",
} as const;
