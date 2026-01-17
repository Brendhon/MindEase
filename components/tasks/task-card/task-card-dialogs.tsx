/**
 * Task Card Dialogs - MindEase
 * Pure functions that return dialog configurations for task card operations
 */

import React from "react";
import type {
  CompletePendingSubtasksDialogConfig,
  SubtaskBreakRequiredDialogConfig,
  SubtaskFocusRequiredDialogConfig,
} from "@/models/task-card-props";
import type { AccessibilityTextKey } from "@/utils/accessibility";
import type { Subtask } from "@/models/task";

export type {
  CompletePendingSubtasksDialogConfig,
  SubtaskFocusRequiredDialogConfig,
  SubtaskBreakRequiredDialogConfig,
};

/**
 * Create dialog configuration for complete pending subtasks
 * @param pendingSubtasks - List of pending subtasks
 * @param getText - Function to get translated text
 * @param testId - Optional test ID prefix
 * @returns Dialog configuration
 */
export function createCompletePendingSubtasksDialogConfig(
  pendingSubtasks: Subtask[],
  getText: (key: AccessibilityTextKey) => string,
  testId?: string
): CompletePendingSubtasksDialogConfig {
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

  return {
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
  };
}

/**
 * Create dialog configuration for subtask focus required
 * @param getText - Function to get translated text
 * @param hasActiveTask - Whether there is already an active task
 * @param onStartFocus - Callback to start focus session
 * @param testId - Optional test ID prefix
 * @returns Dialog configuration
 */
export function createSubtaskFocusRequiredDialogConfig(
  getText: (key: AccessibilityTextKey) => string,
  hasActiveTask: boolean,
  onStartFocus: () => void,
  testId?: string
): SubtaskFocusRequiredDialogConfig {
  return {
    titleKey: "tasks_subtask_focus_required_title",
    descriptionKey: "tasks_subtask_focus_required_message",
    info: (
      <p className={styles.subtaskFocusRequiredDialog}>
        {getText("tasks_subtask_focus_required_hint")}
      </p>
    ),
    cancelLabelKey: "tasks_subtask_focus_required_cancel",
    confirmLabelKey: "tasks_subtask_focus_required_button",
    onCancel: () => {},
    onConfirm: hasActiveTask ? undefined : onStartFocus,
    "data-testid": testId ? `${testId}-focus-required-dialog` : "task-focus-required-dialog",
  };
}

/**
 * Create dialog configuration for subtask break required
 * @returns Dialog configuration
 */
export function createSubtaskBreakRequiredDialogConfig(): SubtaskBreakRequiredDialogConfig {
  return {
    titleKey: "tasks_subtask_break_required_title",
    descriptionKey: "tasks_subtask_break_required_message",
    cancelLabelKey: "button_cancel",
    onCancel: () => {},
  };
}

const styles = {
  subtaskFocusRequiredDialog: "text-text-secondary italic text-sm",
  completePendingSubtasksDialogHint: "text-text-secondary italic text-sm mt-2",
  pendingSubtasksContainer: "flex flex-col gap-2",
  pendingSubtasksLabel: "font-medium text-text-primary text-sm",
  pendingSubtasksList: "flex flex-col gap-1 pl-4",
  pendingSubtasksItem: "text-text-secondary text-sm max-w-72 truncate text-ellipsis",
} as const;
