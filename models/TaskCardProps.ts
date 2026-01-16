/**
 * TaskCard Props and Interfaces - MindEase
 * Centralized type definitions for TaskCard component and its subcomponents
 */

import type { ReactNode } from "react";
import type { Task } from "./Task";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import type { Subtask } from "./Task";

/**
 * Base props shared across TaskCard components
 */
export interface TaskCardBaseProps {
  /** Task data */
  task: Task;

  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Callback functions for task operations
 */
export interface TaskCardCallbacks {
  /** Callback when task is edited */
  onEdit?: (task: Task) => void;

  /** Callback when task is deleted */
  onDelete?: (taskId: string) => void;

  /** Callback when task status changes */
  onStatusChange?: (taskId: string, status: number) => void;

  /** Callback when subtask is toggled */
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

/**
 * Simplified callbacks (without parameters, used internally)
 */
export interface TaskCardSimpleCallbacks {
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
}

/**
 * Timer state props
 */
export interface TaskCardTimerState {
  /** Whether the timer is active for this task */
  isActive: boolean;

  /** Whether the timer is running */
  isRunning: boolean;

  /** Whether there is already an active task (to disable start button) */
  hasActiveTask: boolean;

  /** Whether the break timer is running for this task */
  isBreakRunning?: boolean;
}

/**
 * Main TaskCard component props
 */
export interface TaskCardProps extends TaskCardBaseProps, TaskCardCallbacks {}

/**
 * TaskCardHeader component props
 */
export interface TaskCardHeaderProps extends TaskCardBaseProps {}

/**
 * TaskCardTimer component props
 */
export interface TaskCardTimerProps extends TaskCardBaseProps {}

/**
 * TaskCardActions component props
 */
export interface TaskCardActionsProps
  extends TaskCardBaseProps,
    TaskCardTimerState,
    TaskCardSimpleCallbacks {}

/**
 * TaskCardFocusActions component props
 */
export interface TaskCardFocusActionsProps
  extends TaskCardBaseProps,
    Pick<TaskCardTimerState, "isRunning" | "hasActiveTask" | "isBreakRunning">,
    Pick<TaskCardSimpleCallbacks, "onStartFocus" | "onStop" | "onComplete"> {}

/**
 * TaskCardEditActions component props
 */
export interface TaskCardEditActionsProps
  extends TaskCardBaseProps,
    Pick<TaskCardSimpleCallbacks, "onEdit" | "onDelete"> {}

/**
 * Dialog configuration for complete pending subtasks
 */
export interface CompletePendingSubtasksDialogConfig {
  titleKey: AccessibilityTextKey;
  descriptionKey: AccessibilityTextKey;
  info: ReactNode;
  confirmLabelKey: AccessibilityTextKey;
  "data-testid": string;
}

/**
 * Dialog configuration for subtask focus required
 */
export interface SubtaskFocusRequiredDialogConfig {
  titleKey: AccessibilityTextKey;
  descriptionKey: AccessibilityTextKey;
  info: ReactNode;
  cancelLabelKey: AccessibilityTextKey;
  confirmLabelKey: AccessibilityTextKey;
  onCancel: () => void;
  onConfirm?: () => void;
  "data-testid": string;
}

/**
 * Dialog configuration for subtask break required
 */
export interface SubtaskBreakRequiredDialogConfig {
  titleKey: AccessibilityTextKey;
  descriptionKey: AccessibilityTextKey;
  cancelLabelKey: AccessibilityTextKey;
  onCancel: () => void;
}

/**
 * useTaskCard hook props
 */
export interface UseTaskCardProps extends TaskCardCallbacks {
  /** Task data */
  task: Task;

  /** Test ID for testing (used internally by hook) */
  testId?: string;
}

/**
 * useTaskCard hook return type
 */
export interface UseTaskCardReturn {
  /** CSS classes for the card based on status and focus state */
  cardClasses: string;

  /** Whether focus timer is active for this task */
  isActive: boolean;

  /** Whether focus timer is running for this task */
  isRunning: boolean;

  /** Whether there is already an active task */
  hasActiveTask: boolean;

  /** Whether break timer is running for this task */
  isBreakRunning: boolean;

  /** Whether the card is focused (focus or break active) */
  isFocused: boolean;

  /** Whether task has pending subtasks */
  hasPendingSubtasks: boolean;

  /** Whether checklist should be interactive */
  isChecklistInteractive: boolean;

  /** Handler to start focus session */
  handleStartFocus: () => void;

  /** Handler to stop timer */
  handleStop: () => void;

  /** Handler to complete task */
  handleComplete: () => void;

  /** Handler to edit task */
  handleEdit: () => void;

  /** Handler to delete task */
  handleDelete: () => void;

  /** Handler to toggle subtask */
  handleToggleSubtask: (subtaskId: string) => void;
}
