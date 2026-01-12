"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * TasksError Component - MindEase
 * Error state for tasks page
 */
export interface TasksErrorProps {
  /** Error message to display */
  message?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksError({ message, "data-testid": testId }: TasksErrorProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  const errorMessage = message || textDetail.getText("tasks_error");

  return (
    <div
      className={cn(styles.container, fontSizeClasses.base)}
      data-testid={testId || "tasks-error"}
      role="alert"
    >
      <p className={styles.text}>{errorMessage}</p>
    </div>
  );
}

TasksError.displayName = "TasksError";

const styles = {
  container: "flex items-center justify-center py-12",
  text: "text-action-error",
} as const;
