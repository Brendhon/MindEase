"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";
import { cn } from "@/utils/ui";

/**
 * TasksLoading Component - MindEase
 * Loading state for tasks page
 */
export interface TasksLoadingProps extends BaseComponentProps {}

export function TasksLoading({ "data-testid": testId }: TasksLoadingProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  return (
    <div
      className={cn(styles.container, fontSizeClasses.base)}
      data-testid={testId || "tasks-loading"}
    >
      <p className={styles.text}>
        {getText("tasks_loading")}
      </p>
    </div>
  );
}

TasksLoading.displayName = "TasksLoading";

const styles = {
  container: "flex items-center justify-center py-12",
  text: "text-text-secondary",
} as const;
