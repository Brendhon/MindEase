"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";
import { cn } from "@/utils/ui";

/**
 * TasksError Component - MindEase
 * Error state for tasks page
 */
export interface TasksErrorProps extends BaseComponentProps {
  /** Error message to display */
  message?: string;
}

export function TasksError({ message, "data-testid": testId }: TasksErrorProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  const errorMessage = message || getText("tasks_error");

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
