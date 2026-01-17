"use client";

import { Card } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { Play } from "lucide-react";
import { useMemo } from "react";

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
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

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
    <Card
      className={suggestionClasses}
      data-testid={testId || "break-suggestion"}
    >
      <Card.Header>
        <Card.Title className={messageClasses}>
          {getText("tasks_focus_suggest_break")}
        </Card.Title>

        <Card.Description className={durationClasses}>
          {getText("tasks_focus_suggest_break_duration")} {breakDuration} {getText("tasks_focus_suggest_break_minutes")}
        </Card.Description>
      </Card.Header>

      <Card.Content className={styles.content}>
        {onResume && (
          <Button
            variant="primary"
            size="sm"
            onClick={onResume}
            aria-label={getText("tasks_action_resume_aria")}
            data-testid="break-suggestion-resume"
          >
            <Button.Icon icon={Play} position="left" />
            <Button.Text>
              {getText("tasks_action_resume")}
            </Button.Text>
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

BreakSuggestion.displayName = "BreakSuggestion";

const styles = {
  suggestion: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
  content: "flex flex-col",
  message: "text-text-secondary",
  duration: "text-action-info font-medium mt-1",
} as const;
