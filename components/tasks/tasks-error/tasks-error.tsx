"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * TasksError Component - MindEase
 * Error message display for tasks page
 */
export interface TasksErrorProps {
  /** Error message to display */
  message: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksError({ message, "data-testid": testId }: TasksErrorProps) {
  const { fontSizeClasses } = useCognitiveSettings();

  // Generate error classes with fontSize preference
  const errorClasses = useMemo(
    () => cn(styles.error, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <div
      className={errorClasses}
      role="alert"
      data-testid={testId || "tasks-error"}
    >
      {message}
    </div>
  );
}

TasksError.displayName = "TasksError";

/**
 * TasksError Styles - MindEase
 * Centralized styles for tasks error component
 */

export const styles = {
  error: "bg-action-danger/10 text-action-danger border border-action-danger rounded-lg p-4",
} as const;

