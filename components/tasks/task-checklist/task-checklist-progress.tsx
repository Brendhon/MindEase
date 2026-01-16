"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * TaskChecklistProgress Component - MindEase
 * Displays progress information for task checklist
 */
export interface TaskChecklistProgressProps {
  /** Number of completed subtasks */
  completedCount: number;

  /** Total number of subtasks */
  totalCount: number;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskChecklistProgress({
  completedCount,
  totalCount,
  "data-testid": testId,
}: TaskChecklistProgressProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  const progressText = useMemo(() => {
    return `${completedCount} ${getText("tasks_progress")} ${totalCount} ${getText("tasks_progress_steps")}`;
  }, [completedCount, totalCount, getText]);

  return (
    <p
      className={cn(styles.progress, fontSizeClasses.sm)}
      data-testid={testId || "task-checklist-progress"}
    >
      {progressText}
    </p>
  );
}

TaskChecklistProgress.displayName = "TaskChecklistProgress";

const styles = {
  progress: "text-text-secondary mb-2",
} as const;
