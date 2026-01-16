"use client";

import { Button } from "@/components/ui/button";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
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
  const { getText } = useTextDetail();
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
          {getText("tasks_focus_session_complete")}
        </h3>
        {taskName && (
          <p className={messageClasses}>
            {getText("tasks_focus_active")}: <strong>{taskName}</strong>
          </p>
        )}
      </div>
      <div className={actionsClasses}>
        {onContinue && (
          <Button
            variant="primary"
            size="sm"
            onClick={onContinue}
            aria-label={getText("tasks_focus_session_continue_aria")}
            data-testid="focus-session-alert-continue"
          >
            <Button.Icon icon={Play} position="left" />
            <Button.Text>
              {getText("tasks_focus_session_continue")}
            </Button.Text>
          </Button>
        )}
        {onPause && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onPause}
            aria-label={getText("tasks_focus_session_pause_aria")}
            data-testid="focus-session-alert-pause"
          >
            <Button.Icon icon={Pause} position="left" />
            <Button.Text>
              {getText("tasks_focus_session_pause")}
            </Button.Text>
          </Button>
        )}
        {onFinish && (
          <Button
            variant="primary"
            size="sm"
            onClick={onFinish}
            aria-label={getText("tasks_focus_session_finish_aria")}
            data-testid="focus-session-alert-finish"
          >
            <Button.Icon icon={Check} position="left" />
            <Button.Text>
              {getText("tasks_focus_session_finish")}
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
