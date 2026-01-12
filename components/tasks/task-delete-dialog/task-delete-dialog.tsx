"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * TaskDeleteDialog Component - MindEase
 * Confirmation dialog for task deletion
 */
export interface TaskDeleteDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  
  /** Callback when dialog is closed */
  onClose: () => void;
  
  /** Callback when deletion is confirmed */
  onConfirm: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  "data-testid": testId,
}: TaskDeleteDialogProps) {
  const { spacingClasses, textDetail } = useCognitiveSettings();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const actionsClasses = cn(styles.actions, spacingClasses.gap);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={textDetail.getText("tasks_delete_confirm_title")}
      data-testid={testId || "task-delete-dialog"}
    >
      <div className={styles.content}>
        <p className={styles.message}>
          {textDetail.getText("tasks_delete_confirm_message")}
        </p>
        <div className={actionsClasses}>
          <Button
            variant="ghost"
            onClick={onClose}
            data-testid="task-delete-dialog-cancel"
          >
            <Button.Text>
              {textDetail.getText("tasks_delete_confirm_cancel")}
            </Button.Text>
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            data-testid="task-delete-dialog-confirm"
          >
            <Button.Text>
              {textDetail.getText("tasks_delete_confirm_button")}
            </Button.Text>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

TaskDeleteDialog.displayName = "TaskDeleteDialog";

const styles = {
  content: "flex flex-col",
  message: "text-text-primary mb-4",
  actions: "flex justify-end gap-2",
} as const;
