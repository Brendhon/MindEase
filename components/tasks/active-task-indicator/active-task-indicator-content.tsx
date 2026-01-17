"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import type { Task } from "@/models/Task";
import { truncateText } from "@/utils/formatting";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
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

const MAX_TITLE_LENGTH = 40;

export function ActiveTaskIndicatorContent({
  task,
  "data-testid": testId,
}: ActiveTaskIndicatorContentProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  // Truncate task title if needed
  const displayTitle = useMemo(() => {
    if (!task?.title) return null;
    return truncateText(task.title, MAX_TITLE_LENGTH);
  }, [task?.title]);

  return (
    <div
      className={styles.textContainer}
      data-testid={testId || "active-task-indicator-content"}
    >
      {displayTitle ? (
        <p className={cn(styles.title, fontSizeClasses.base)}>
          {displayTitle}
        </p>
      ) : null}
    </div>
  );
}

ActiveTaskIndicatorContent.displayName = "ActiveTaskIndicatorContent";
