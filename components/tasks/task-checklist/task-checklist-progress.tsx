"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
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
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  const progressText = useMemo(() => {
    return `${completedCount} ${textDetail.getText("tasks_progress")} ${totalCount} ${textDetail.getText("tasks_progress_steps")}`;
  }, [completedCount, totalCount, textDetail]);

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
