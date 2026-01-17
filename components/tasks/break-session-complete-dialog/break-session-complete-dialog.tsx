"use client";

import { SessionCompleteDialog, type SessionAction } from "@/components/tasks/session-complete-dialog";
import { useTextDetail } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";
import { Play, X } from "lucide-react";
import { useMemo } from "react";

/**
 * BreakSessionCompleteDialog Component - MindEase
 * Dialog shown when break timer reaches zero
 * Provides guided decision: start new focus session or end focus
 */
export interface BreakSessionCompleteDialogProps extends BaseComponentProps {
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

  // Get localized texts with placeholders replaced
  const titleText = getText("tasks_break_session_complete_title");
  const messageText = getTextWithReplace("tasks_break_session_complete_message", { minutes: breakDuration.toString() });
  const questionText = getText("tasks_break_session_complete");

  const startFocusText = getTextWithReplace("tasks_break_session_start_focus", { minutes: focusDuration.toString() });
  const startFocusAria = getTextWithReplace("tasks_break_session_start_focus_aria", { minutes: focusDuration.toString() });

  const endFocusText = getText("tasks_break_session_end_focus");
  const endFocusAria = getText("tasks_break_session_end_focus_aria");

  // Build actions array
  const actions = useMemo<SessionAction[]>(() => {
    const actionList: SessionAction[] = [];

    if (onStartFocus) {
      actionList.push({
        id: "start-focus",
        variant: "primary",
        icon: Play,
        text: startFocusText,
        ariaLabel: startFocusAria,
        onClick: () => {
          onStartFocus();
          onClose();
        },
        testId: "break-session-complete-start-focus",
        condition: true,
      });
    }

    if (onEndFocus) {
      actionList.push({
        id: "end-focus",
        variant: "secondary",
        icon: X,
        text: endFocusText,
        ariaLabel: endFocusAria,
        onClick: () => {
          onEndFocus();
          onClose();
        },
        testId: "break-session-complete-end-focus",
        condition: true,
      });
    }

    return actionList;
  }, [onStartFocus, onEndFocus, onClose, startFocusText, startFocusAria, endFocusText, endFocusAria]);

  return (
    <SessionCompleteDialog
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      message={messageText}
      question={questionText}
      actions={actions}
      data-testid={testId || "break-session-complete-dialog"}
    />
  );
}

BreakSessionCompleteDialog.displayName = "BreakSessionCompleteDialog";
