"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import { cn } from "@/utils/ui";
import { Play, X } from "lucide-react";
import { useMemo } from "react";

/**
 * BreakSessionCompleteDialog Component - MindEase
 * Dialog shown when break timer reaches zero
 * Provides guided decision: start new focus session or end focus
 */
export interface BreakSessionCompleteDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;

  /** Callback when dialog is closed */
  onClose: () => void;

  /** Duration of the completed break session in minutes */
  breakDuration: number;

  /** Focus duration in minutes (for starting new focus session) */
  focusDuration: number;

  /** Callback to start new focus session */
  onStartFocus?: () => void;

  /** Callback to end focus */
  onEndFocus?: () => void;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function BreakSessionCompleteDialog({
  isOpen,
  onClose,
  breakDuration,
  focusDuration,
  onStartFocus,
  onEndFocus,
  "data-testid": testId,
}: BreakSessionCompleteDialogProps) {
  const { getTextWithReplace, getText } = useTextDetail();
  const { spacingClasses, fontSizeClasses } = useAccessibilityClasses();

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

  const handleStartFocus = () => {
    onStartFocus?.();
    onClose();
  };

  const handleEndFocus = () => {
    onEndFocus?.();
    onClose();
  };

  // Get localized texts with placeholders replaced
  const titleText = getText("tasks_break_session_complete_title");
  const messageText = getTextWithReplace("tasks_break_session_complete_message", { minutes: breakDuration.toString() });

  const startFocusText = getTextWithReplace("tasks_break_session_start_focus", { minutes: focusDuration.toString() });
  const startFocusAria = getTextWithReplace("tasks_break_session_start_focus_aria", { minutes: focusDuration.toString() });

  const endFocusText = getText("tasks_break_session_end_focus");
  const endFocusAria = getText("tasks_break_session_end_focus_aria");

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      preventClose={true}
      data-testid={testId || "break-session-complete-dialog"}
    >
      <div className={contentClasses}>
        <p className={messageClasses}>
          {messageText}
        </p>

        <p className={cn(styles.question, fontSizeClasses.base)}>
          {getText("tasks_break_session_complete")}
        </p>

        <div className={actionsClasses}>
          {onStartFocus && (
            <Button
              variant="primary"
              onClick={handleStartFocus}
              aria-label={startFocusAria}
              data-testid="break-session-complete-start-focus"
              className={styles.button}
            >
              <Button.Icon icon={Play} position="left" />
              <Button.Text>
                {startFocusText}
              </Button.Text>
            </Button>
          )}

          {onEndFocus && (
            <Button
              variant="secondary"
              onClick={handleEndFocus}
              aria-label={endFocusAria}
              data-testid="break-session-complete-end-focus"
              className={styles.button}
            >
              <Button.Icon icon={X} position="left" />
              <Button.Text>
                {endFocusText}
              </Button.Text>
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

BreakSessionCompleteDialog.displayName = "BreakSessionCompleteDialog";

const styles = {
  content: "flex flex-col",
  message: "text-text-primary mb-2",
  question: "text-text-secondary mb-4 font-medium",
  actions: "flex flex-col gap-2 mt-2",
  button: "w-full justify-start",
} as const;
