"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import type { Subtask } from "@/models/Task";

/**
 * TaskPendingSubtasksDialog Component - MindEase
 * Informative dialog shown when user tries to complete a task with pending subtasks
 */
export interface TaskPendingSubtasksDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  
  /** Callback when dialog is closed */
  onClose: () => void;
  
  /** List of pending subtasks */
  pendingSubtasks: Subtask[];
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskPendingSubtasksDialog({
  isOpen,
  onClose,
  pendingSubtasks,
  "data-testid": testId,
}: TaskPendingSubtasksDialogProps) {
  const { spacingClasses, fontSizeClasses, textDetail } = useCognitiveSettings();

  const pendingCount = pendingSubtasks.length;

  const contentClasses = cn(styles.content, spacingClasses.gap);
  const messageClasses = cn(styles.message, fontSizeClasses.base);
  const listClasses = cn(styles.list, spacingClasses.gap);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={textDetail.getText("tasks_complete_pending_title")}
      data-testid={testId || "task-pending-subtasks-dialog"}
    >
      <div className={contentClasses}>
        <p className={messageClasses}>
          {textDetail.getText("tasks_complete_pending_message")}
        </p>
        
        {pendingCount > 0 && (
          <div className={styles.subtasksSection}>
            <p className={cn(styles.subtasksLabel, fontSizeClasses.sm)}>
              {textDetail.getText("tasks_complete_pending_list_label")}
            </p>
            <ul className={listClasses} role="list">
              {pendingSubtasks.map((subtask) => (
                <li
                  key={subtask.id}
                  className={cn(styles.subtaskItem, fontSizeClasses.sm)}
                  data-testid={`pending-subtask-${subtask.id}`}
                >
                  • {subtask.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className={cn(styles.hint, fontSizeClasses.sm)}>
          {textDetail.getText("tasks_complete_pending_hint")}
        </p>

        <div className={cn(styles.actions, spacingClasses.gap)}>
          <Button
            variant="primary"
            onClick={onClose}
            data-testid="task-pending-subtasks-dialog-ok"
          >
            <Button.Text>
              {textDetail.getText("tasks_complete_pending_button")}
            </Button.Text>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

TaskPendingSubtasksDialog.displayName = "TaskPendingSubtasksDialog";

const styles = {
  content: "flex flex-col",
  message: "text-text-primary",
  subtasksSection: "flex flex-col gap-2",
  subtasksLabel: "font-medium text-text-primary",
  list: "flex flex-col gap-1 pl-4",
  subtaskItem: "text-text-secondary",
  hint: "text-text-secondary italic",
  actions: "flex justify-end gap-2 mt-4",
} as const;
