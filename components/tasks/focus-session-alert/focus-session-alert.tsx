"use client";

import { Button } from "@/components/ui/button";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { Check, Pause, Play } from "lucide-react";
import { useMemo } from "react";

/**
 * FocusSessionAlert Component - MindEase
 * Alert banner shown when focus session completes
 */
export interface FocusSessionAlertProps {
  /** Whether alert is visible */
  isVisible: boolean;
  
  /** Task name that was in focus */
  taskName?: string;
  
  /** Callback to continue focus session */
  onContinue?: () => void;
  
  /** Callback to pause focus session */
  onPause?: () => void;
  
  /** Callback to finish task */
  onFinish?: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function FocusSessionAlert({
  isVisible,
  taskName,
  onContinue,
  onPause,
  onFinish,
  "data-testid": testId,
}: FocusSessionAlertProps) {
  const { textDetail } = useCognitiveSettings();
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();

  if (!isVisible) {
    return null;
  }

  const alertClasses = useMemo(
    () => cn(styles.alert, spacingClasses.padding),
    [spacingClasses.padding]
  );

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const messageClasses = useMemo(
    () => cn(styles.message, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const actionsClasses = useMemo(
    () => cn(styles.actions, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <div
      className={alertClasses}
      role="alert"
      data-testid={testId || "focus-session-alert"}
    >
      <div className={styles.content}>
        <h3 className={titleClasses}>
          {textDetail.getText("tasks_focus_session_complete" as AccessibilityTextKey)}
        </h3>
        {taskName && (
          <p className={messageClasses}>
            {textDetail.getText("tasks_focus_active" as AccessibilityTextKey)}: <strong>{taskName}</strong>
          </p>
        )}
      </div>
      <div className={actionsClasses}>
        {onContinue && (
          <Button
            variant="primary"
            size="sm"
            onClick={onContinue}
            aria-label={textDetail.getText("tasks_focus_session_continue_aria" as AccessibilityTextKey)}
            data-testid="focus-session-alert-continue"
          >
            <Button.Icon icon={Play} position="left" />
            <Button.Text>
              {textDetail.getText("tasks_focus_session_continue" as AccessibilityTextKey)}
            </Button.Text>
          </Button>
        )}
        {onPause && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onPause}
            aria-label={textDetail.getText("tasks_focus_session_pause_aria" as AccessibilityTextKey)}
            data-testid="focus-session-alert-pause"
          >
            <Button.Icon icon={Pause} position="left" />
            <Button.Text>
              {textDetail.getText("tasks_focus_session_pause" as AccessibilityTextKey)}
            </Button.Text>
          </Button>
        )}
        {onFinish && (
          <Button
            variant="primary"
            size="sm"
            onClick={onFinish}
            aria-label={textDetail.getText("tasks_focus_session_finish_aria" as AccessibilityTextKey)}
            data-testid="focus-session-alert-finish"
          >
            <Button.Icon icon={Check} position="left" />
            <Button.Text>
              {textDetail.getText("tasks_focus_session_finish" as AccessibilityTextKey)}
            </Button.Text>
          </Button>
        )}
      </div>
    </div>
  );
}

FocusSessionAlert.displayName = "FocusSessionAlert";

const styles = {
  alert: "flex flex-col bg-action-info/10 border border-action-info rounded-lg gap-4",
  content: "flex flex-col",
  title: "font-semibold text-action-info",
  message: "text-text-secondary mt-1",
  actions: "flex flex-wrap items-center gap-2",
} as const;
