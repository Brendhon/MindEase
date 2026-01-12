"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * TaskFocusRequiredDialog Component - MindEase
 * Informative dialog shown when user tries to complete a subtask without focus
 */
export interface TaskFocusRequiredDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  
  /** Callback when dialog is closed */
  onClose: () => void;
  
  /** Callback to start focus session */
  onStartFocus: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskFocusRequiredDialog({
  isOpen,
  onClose,
  onStartFocus,
  "data-testid": testId,
}: TaskFocusRequiredDialogProps) {
  const { spacingClasses, fontSizeClasses, textDetail } = useCognitiveSettings();

  const handleStartFocus = () => {
    onStartFocus();
    onClose();
  };

  const contentClasses = cn(styles.content, spacingClasses.gap);
  const messageClasses = cn(styles.message, fontSizeClasses.base);
  const hintClasses = cn(styles.hint, fontSizeClasses.sm);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={textDetail.getText("tasks_subtask_focus_required_title")}
      data-testid={testId || "task-focus-required-dialog"}
    >
      <div className={contentClasses}>
        <p className={messageClasses}>
          {textDetail.getText("tasks_subtask_focus_required_message")}
        </p>
        
        <p className={hintClasses}>
          {textDetail.getText("tasks_subtask_focus_required_hint")}
        </p>

        <div className={cn(styles.actions, spacingClasses.gap)}>
          <Button
            variant="ghost"
            onClick={onClose}
            data-testid="task-focus-required-dialog-cancel"
          >
            <Button.Text>
              {textDetail.getText("tasks_subtask_focus_required_cancel")}
            </Button.Text>
          </Button>
          <Button
            variant="primary"
            onClick={handleStartFocus}
            data-testid="task-focus-required-dialog-start"
          >
            <Button.Text>
              {textDetail.getText("tasks_subtask_focus_required_button")}
            </Button.Text>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

TaskFocusRequiredDialog.displayName = "TaskFocusRequiredDialog";

const styles = {
  content: "flex flex-col",
  message: "text-text-primary",
  hint: "text-text-secondary italic",
  actions: "flex justify-end gap-2 mt-4",
} as const;
