"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * TasksLoading Component - MindEase
 * Loading state for tasks page
 */
export interface TasksLoadingProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksLoading({ "data-testid": testId }: TasksLoadingProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  return (
    <div
      className={cn(styles.container, fontSizeClasses.base)}
      data-testid={testId || "tasks-loading"}
    >
      <p className={styles.text}>
        {textDetail.getText("tasks_loading")}
      </p>
    </div>
  );
}

TasksLoading.displayName = "TasksLoading";

const styles = {
  container: "flex items-center justify-center py-12",
  text: "text-text-secondary",
} as const;
