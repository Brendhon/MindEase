"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { Task } from "@/models/Task";
import { canCompleteTask } from "@/utils/tasks";
import { cn } from "@/utils/ui";
import { Check, Coffee, Play } from "lucide-react";
import { useMemo } from "react";

/**
 * FocusSessionCompleteDialog Component - MindEase
 * Dialog shown when focus session timer reaches zero
 * Provides guided decision: start break, continue focus, or finish task
 */
export interface FocusSessionCompleteDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;

  /** Callback when dialog is closed */
  onClose: () => void;

  /** Duration of the completed focus session in minutes */
  focusDuration: number;

  /** Break duration in minutes */
  breakDuration: number;

  /** Active task (to check if it can be finished) */
  activeTask?: Task | null;

  /** Callback to start break */
  onStartBreak?: () => void;

  /** Callback to continue focus session */
  onContinueFocus?: () => void;

  /** Callback to finish task */
  onFinishTask?: () => void;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function FocusSessionCompleteDialog({
  isOpen,
  onClose,
  focusDuration,
  breakDuration,
  activeTask,
  onStartBreak,
  onContinueFocus,
  onFinishTask,
  "data-testid": testId,
}: FocusSessionCompleteDialogProps) {
  const { getTextWithReplace, getText } = useTextDetail();
  const { spacingClasses, fontSizeClasses } = useAccessibilityClasses();

  // Check if task can be finished (no pending subtasks)
  const canFinish = useMemo(() => {
    return activeTask ? canCompleteTask(activeTask) : false;
  }, [activeTask]);

  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const messageClasses = useMemo(
    () => cn(styles.message, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const actionsClasses = useMemo(
    () => cn(styles.actions, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const handleStartBreak = () => {
    onStartBreak?.();
    onClose();
  };

  const handleContinueFocus = () => {
    onContinueFocus?.();
    onClose();
  };

  const handleFinishTask = () => {
    onFinishTask?.();
    onClose();
  };

  // Get localized texts with placeholders replaced
  const titleText = getText("tasks_focus_session_complete_title");
  const messageText = getTextWithReplace("tasks_focus_session_complete_message", { minutes: focusDuration.toString() });
  const startBreakText = getTextWithReplace("tasks_focus_session_start_break", { minutes: breakDuration.toString() });
  const startBreakAria = getTextWithReplace("tasks_focus_session_start_break_aria", { minutes: breakDuration.toString() });
  const continueFocusText = getTextWithReplace("tasks_focus_session_continue_focus", { minutes: focusDuration.toString() });
  const continueFocusAria = getTextWithReplace("tasks_focus_session_continue_focus_aria", { minutes: focusDuration.toString() });

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      preventClose={true}
      data-testid={testId || "focus-session-complete-dialog"}
    >
      <div className={contentClasses}>
        <p className={messageClasses}>
          {messageText}
        </p>

        <p className={cn(styles.question, fontSizeClasses.base)}>
          {getText("tasks_focus_session_complete")}
        </p>

        <div className={actionsClasses}>
          {onStartBreak && (
            <Button
              variant="secondary"
              onClick={handleStartBreak}
              aria-label={startBreakAria}
              data-testid="focus-session-complete-start-break"
              className={styles.button}
            >
              <Button.Icon icon={Coffee} position="left" />
              <Button.Text>
                {startBreakText}
              </Button.Text>
            </Button>
          )}

          {onContinueFocus && (
            <Button
              variant="primary"
              onClick={handleContinueFocus}
              aria-label={continueFocusAria}
              data-testid="focus-session-complete-continue"
              className={styles.button}
            >
              <Button.Icon icon={Play} position="left" />
              <Button.Text>
                {continueFocusText}
              </Button.Text>
            </Button>
          )}

          {onFinishTask && canFinish && (
            <Button
              variant="primary"
              onClick={handleFinishTask}
              aria-label={getText("tasks_focus_session_finish_aria")}
              data-testid="focus-session-complete-finish"
              className={styles.button}
            >
              <Button.Icon icon={Check} position="left" />
              <Button.Text>
                {getText("tasks_focus_session_finish")}
              </Button.Text>
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

FocusSessionCompleteDialog.displayName = "FocusSessionCompleteDialog";

const styles = {
  content: "flex flex-col",
  message: "text-text-primary mb-2",
  question: "text-text-secondary mb-4 font-medium",
  actions: "flex flex-col gap-2 mt-2",
  button: "w-full justify-start",
} as const;
