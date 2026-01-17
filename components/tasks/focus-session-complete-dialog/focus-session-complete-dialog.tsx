"use client";

import { SessionCompleteDialog, type SessionAction } from "@/components/tasks/session-complete-dialog";
import { useTextDetail } from "@/hooks/accessibility";
import type { Task } from "@/models/Task";
import { canCompleteTask } from "@/utils/tasks";
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

  // Check if task can be finished (no pending subtasks)
  const canFinish = useMemo(() => {
    return activeTask ? canCompleteTask(activeTask) : false;
  }, [activeTask]);

  // Get localized texts with placeholders replaced
  const titleText = getText("tasks_focus_session_complete_title");
  const messageText = getTextWithReplace("tasks_focus_session_complete_message", { minutes: focusDuration.toString() });
  const questionText = getText("tasks_focus_session_complete");

  const startBreakText = getTextWithReplace("tasks_focus_session_start_break", { minutes: breakDuration.toString() });
  const startBreakAria = getTextWithReplace("tasks_focus_session_start_break_aria", { minutes: breakDuration.toString() });
  const continueFocusText = getTextWithReplace("tasks_focus_session_continue_focus", { minutes: focusDuration.toString() });
  const continueFocusAria = getTextWithReplace("tasks_focus_session_continue_focus_aria", { minutes: focusDuration.toString() });
  const finishText = getText("tasks_focus_session_finish");
  const finishAria = getText("tasks_focus_session_finish_aria");

  // Build actions array
  const actions = useMemo<SessionAction[]>(() => {
    const actionList: SessionAction[] = [];

    if (onStartBreak) {
      actionList.push({
        id: "start-break",
        variant: "secondary",
        icon: Coffee,
        text: startBreakText,
        ariaLabel: startBreakAria,
        onClick: () => {
          onStartBreak();
          onClose();
        },
        testId: "focus-session-complete-start-break",
        condition: true,
      });
    }

    if (onContinueFocus) {
      actionList.push({
        id: "continue-focus",
        variant: "primary",
        icon: Play,
        text: continueFocusText,
        ariaLabel: continueFocusAria,
        onClick: () => {
          onContinueFocus();
          onClose();
        },
        testId: "focus-session-complete-continue",
        condition: true,
      });
    }

    if (onFinishTask) {
      actionList.push({
        id: "finish-task",
        variant: "primary",
        icon: Check,
        text: finishText,
        ariaLabel: finishAria,
        onClick: () => {
          onFinishTask();
          onClose();
        },
        testId: "focus-session-complete-finish",
        condition: canFinish,
      });
    }

    return actionList;
  }, [
    onStartBreak,
    onContinueFocus,
    onFinishTask,
    onClose,
    startBreakText,
    startBreakAria,
    continueFocusText,
    continueFocusAria,
    finishText,
    finishAria,
    canFinish,
  ]);

  return (
    <SessionCompleteDialog
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      message={messageText}
      question={questionText}
      actions={actions}
      data-testid={testId || "focus-session-complete-dialog"}
    />
  );
}

FocusSessionCompleteDialog.displayName = "FocusSessionCompleteDialog";
