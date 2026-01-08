"use client";

import { useMemo } from "react";
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
  const { fontSizeClasses, animationClasses, spacingClasses, textDetail } = useCognitiveSettings();

  const containerClasses = useMemo(
    () => cn(styles.container, animationClasses),
    [animationClasses]
  );

  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const loadingClasses = useMemo(
    () => cn(styles.loading, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <div className={containerClasses} data-testid={testId || "tasks-loading-container"}>
      <div className={mainClasses}>
        <p className={loadingClasses} data-testid={testId ? `${testId}-text` : "tasks-loading"}>
          {textDetail.getText("loading")}
        </p>
      </div>
    </div>
  );
}

TasksLoading.displayName = "TasksLoading";

/**
 * TasksLoading Styles - MindEase
 * Centralized styles for tasks loading component
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-7xl mx-auto",
  loading: "text-text-secondary text-center",
} as const;



