/**
 * useTaskCard Hook - MindEase
 * Encapsulates all business logic for TaskCard component
 * 
 * This hook handles:
 * - Timer state management (focus and break)
 * - Task status management
 * - Dialog management
 * - Subtask validation and toggling
 * - Event handlers
 * - Derived state calculations
 * 
 * The component only needs to call this hook and render the UI.
 * 
 * @example
 * ```tsx
 * function TaskCard({ task, onEdit, onDelete, onStatusChange, onToggleSubtask }) {
 *   const {
 *     cardClasses,
 *     isActive,
 *     isRunning,
 *     hasActiveTask,
 *     isBreakRunning,
 *     handleStartFocus,
 *     handleStop,
 *     handleComplete,
 *     handleEdit,
 *     handleDelete,
 *     handleToggleSubtask,
 *   } = useTaskCard({
 *     task,
 *     onEdit,
 *     onDelete,
 *     onStatusChange,
 *     onToggleSubtask,
 *     testId,
 *   });
 *   
 *   return <Card className={cardClasses}>...</Card>;
 * }
 * ```
 */

"use client";

import {
  createCompletePendingSubtasksDialogConfig,
  createSubtaskBreakRequiredDialogConfig,
  createSubtaskFocusRequiredDialogConfig,
} from "@/components/tasks/task-card/task-card-dialogs";
import { getTaskCardClasses } from "@/components/tasks/task-card/task-card-styles";
import { useMissingBreakAlert, useProlongedNavigationAlert } from "@/hooks/cognitive-alerts";
import { useBreakTimer } from "@/hooks/break-timer";
import { useDialog } from "@/hooks/dialog";
import { useFeedback } from "@/hooks/feedback";
import { useFocusTimer } from "@/hooks/focus-timer";
import { useTasks } from "@/hooks/tasks";
import { useTextDetail } from "@/hooks/accessibility";
import type { UseTaskCardProps, UseTaskCardReturn } from "@/models/task-card-props";
import { canCompleteTask, getPendingSubtasks } from "@/utils/tasks";
import { useCallback, useMemo } from "react";

/**
 * Hook for managing TaskCard business logic
 * @param props - TaskCard configuration
 * @returns TaskCard state and handlers
 */
export function useTaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  testId,
}: UseTaskCardProps): UseTaskCardReturn {
  // Hooks
  const { startTimer, stopTimer, isActive: isFocusActive, isRunning: isFocusRunning } = useFocusTimer();
  const { stopBreak, isActive: isBreakActive, isRunning: isBreakRunning } = useBreakTimer();
  const { recordTaskFinished } = useMissingBreakAlert();
  const { recordUserAction } = useProlongedNavigationAlert();
  const { openDialog } = useDialog();
  const { getText } = useTextDetail();
  const { success } = useFeedback();
  const { hasTasksInProgress } = useTasks();

  // Derived state
  const hasActiveTask = hasTasksInProgress(task.id);
  const isActive = isFocusActive(task.id);
  const isRunning = isFocusRunning(task.id);
  const isBreakRunningForTask = isBreakActive(task.id) && isBreakRunning(task.id);
  const isFocused = isActive || isBreakActive(task.id);

  // Check if task has pending subtasks (using centralized utility)
  const hasPendingSubtasks = useMemo(() => {
    return !canCompleteTask(task);
  }, [task]);

  // Get pending subtasks (using centralized utility)
  const pendingSubtasks = useMemo(() => {
    return getPendingSubtasks(task);
  }, [task]);

  // Card classes based on status and focus state
  const cardClasses = useMemo(() => {
    return getTaskCardClasses(task, isFocusActive);
  }, [task, isFocusActive]);

  // Checklist interactive state
  const isChecklistInteractive = isActive && isRunning;

  // Handle focus actions
  const handleStartFocus = useCallback(() => {
    startTimer(task.id);
    onStatusChange?.(task.id, 1); // Set to In Progress
    // Record user action (resets prolonged navigation timer)
    recordUserAction();
  }, [startTimer, task.id, onStatusChange, recordUserAction]);

  const handleStop = useCallback(() => {
    // Stop both focus timer and break timer if break is active
    stopBreak();
    stopTimer();
    // Return task to To Do when focus is stopped
    onStatusChange?.(task.id, 0);
    // Record that focus was stopped (reset counter - cycle was interrupted)
    recordTaskFinished();
  }, [stopBreak, stopTimer, task.id, onStatusChange, recordTaskFinished]);

  const handleComplete = useCallback(() => {
    // Check if task has pending subtasks
    if (hasPendingSubtasks) {
      const config = createCompletePendingSubtasksDialogConfig(
        pendingSubtasks,
        getText,
        testId
      );
      openDialog(config);
    } else {
      stopTimer();
      onStatusChange?.(task.id, 2);
      // Record that task was finished (reset counter)
      recordTaskFinished();
    }
  }, [hasPendingSubtasks, pendingSubtasks, getText, testId, openDialog, stopTimer, task.id, onStatusChange, recordTaskFinished]);

  const handleEdit = useCallback(() => {
    onEdit?.(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    onDelete?.(task.id);
  }, [onDelete, task.id]);

  // Dialog for subtask focus required
  const subtaskFocusRequiredDialog = useCallback(() => {
    const config = createSubtaskFocusRequiredDialogConfig(
      getText,
      hasActiveTask,
      handleStartFocus,
      testId
    );
    openDialog(config);
  }, [openDialog, getText, hasActiveTask, handleStartFocus, testId]);

  const subtaskBreakRequiredDialog = useCallback(() => {
    const config = createSubtaskBreakRequiredDialogConfig();
    openDialog(config);
  }, [openDialog]);

  const handleToggleSubtask = useCallback(
    (subtaskId: string) => {
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
        // Record user action when subtask is completed (resets prolonged navigation timer)
        recordUserAction();
      }
    },
    [
      isBreakActive,
      isBreakRunning,
      task.id,
      task.subtasks,
      isFocusActive,
      isFocusRunning,
      subtaskBreakRequiredDialog,
      subtaskFocusRequiredDialog,
      onToggleSubtask,
      success,
      recordUserAction,
    ]
  );

  return {
    cardClasses,
    isActive,
    isRunning,
    hasActiveTask,
    isBreakRunning: isBreakRunningForTask,
    isFocused,
    hasPendingSubtasks,
    isChecklistInteractive,
    handleStartFocus,
    handleStop,
    handleComplete,
    handleEdit,
    handleDelete,
    handleToggleSubtask,
  };
}
