"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * TasksHeader Component - MindEase
 * Header section for tasks page with title and description
 */
export interface TasksHeaderProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksHeader({ "data-testid": testId }: TasksHeaderProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  // Generate title classes with fontSize preference
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses["2xl"]),
    [fontSizeClasses["2xl"]]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <header className={styles.header} data-testid={testId || "tasks-header"}>
      <h1 className={titleClasses} data-testid={testId ? `${testId}-title` : "tasks-title"}>
        {textDetail.getText("tasks")}
      </h1>
      <p className={descriptionClasses} data-testid={testId ? `${testId}-description` : "tasks-description"}>
        {textDetail.getText("tasks_description")}
      </p>
    </header>
  );
}

TasksHeader.displayName = "TasksHeader";

/**
 * TasksHeader Styles - MindEase
 * Centralized styles for tasks header component
 */

export const styles = {
  header: "flex flex-col",
  title: "font-semibold text-text-primary leading-tight",
  description: "text-text-secondary leading-relaxed mt-2",
} as const;



