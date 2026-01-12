"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { Play } from "lucide-react";

/**
 * BreakSuggestion Component - MindEase
 * Subtle suggestion banner shown when focus session is paused
 * Suggests a break duration configured in dashboard
 */
export interface BreakSuggestionProps {
  /** Whether suggestion is visible */
  isVisible: boolean;
  
  /** Suggested break duration in minutes */
  breakDuration: number;
  
  /** Callback to resume focus session */
  onResume?: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function BreakSuggestion({
  isVisible,
  breakDuration,
  onResume,
  "data-testid": testId,
}: BreakSuggestionProps) {
  const { fontSizeClasses, spacingClasses, textDetail } = useCognitiveSettings();

  const suggestionClasses = useMemo(
    () => cn(styles.suggestion, spacingClasses.padding),
    [spacingClasses.padding]
  );

  const messageClasses = useMemo(
    () => cn(styles.message, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const durationClasses = useMemo(
    () => cn(styles.duration, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={suggestionClasses}
      role="region"
      aria-label="Sugestão de pausa"
      data-testid={testId || "break-suggestion"}
    >
      <div className={styles.content}>
        <p className={messageClasses}>
          {textDetail.getText("tasks_focus_suggest_break" as AccessibilityTextKey)}
        </p>
        <p className={durationClasses}>
          {textDetail.getText("tasks_focus_suggest_break_duration" as AccessibilityTextKey)} {breakDuration} {textDetail.getText("tasks_focus_suggest_break_minutes" as AccessibilityTextKey)}
        </p>
      </div>
      {onResume && (
        <Button
          variant="primary"
          size="sm"
          onClick={onResume}
          aria-label={textDetail.getText("tasks_action_resume_aria" as AccessibilityTextKey)}
          data-testid="break-suggestion-resume"
        >
          <Button.Icon icon={Play} position="left" />
          <Button.Text>
            {textDetail.getText("tasks_action_resume" as AccessibilityTextKey)}
          </Button.Text>
        </Button>
      )}
    </div>
  );
}

BreakSuggestion.displayName = "BreakSuggestion";

const styles = {
  suggestion: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-action-info/5 border border-action-info/20 rounded-lg",
  content: "flex flex-col",
  message: "text-text-secondary",
  duration: "text-action-info font-medium mt-1",
} as const;
