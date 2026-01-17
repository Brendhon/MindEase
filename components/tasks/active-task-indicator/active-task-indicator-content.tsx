"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import type { Task } from "@/models/Task";
import { cn } from "@/utils/ui";
import { styles } from "./active-task-indicator-styles";

/**
 * ActiveTaskIndicatorContent Component - MindEase
 * Displays task title and status text
 */
export interface ActiveTaskIndicatorContentProps {
  /** Task object or null */
  task: Task | null;
    
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ActiveTaskIndicatorContent({
  task,
  "data-testid": testId,
}: ActiveTaskIndicatorContentProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  return (
    <div
      className={styles.textContainer}
      data-testid={testId || "active-task-indicator-content"}
    >
      {task?.title ? (
        <p className={cn(styles.title, fontSizeClasses.base)}>
          {task.title}
        </p>
      ) : null}

      {task?.description && (
        <p className={cn(styles.description, fontSizeClasses.sm)}>
          {task.description}
        </p>
      )}
    </div>
  );
}

ActiveTaskIndicatorContent.displayName = "ActiveTaskIndicatorContent";
