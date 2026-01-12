"use client";

import { useMemo } from "react";
import { CardHeader } from "@/components/ui/card/card-header";
import { CardTitle } from "@/components/ui/card/card-title";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import type { Task } from "@/models/Task";

export interface TaskCardHeaderProps {
  /** Task data */
  task: Task;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * TaskCardHeader Component - MindEase
 * Displays task title, status badge, and description
 */
export function TaskCardHeader({
  task,
  "data-testid": testId,
}: TaskCardHeaderProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  // Get status label
  const statusLabel = useMemo(() => {
    switch (task.status) {
      case 0:
        return textDetail.getText("tasks_status_todo");
      case 1:
        return textDetail.getText("tasks_status_in_progress");
      default:
        return textDetail.getText("tasks_status_done");
    }
  }, [task.status]);

  return (
    <CardHeader>
      <div className={styles.headerRow}>
        <CardTitle className={cn(fontSizeClasses.base, styles.title)}>
          {task.title}
        </CardTitle>
        <span
          className={cn(
            styles.status,
            fontSizeClasses.sm,
            task.status === 0 && styles.statusTodo,
            task.status === 1 && styles.statusInProgress,
            task.status === 2 && styles.statusDone
          )}
          data-testid={testId || `task-card-status-${task.id}`}
        >
          {statusLabel}
        </span>
      </div>
      {task.description && (
        <p className={cn(styles.description, fontSizeClasses.sm)}>
          {task.description}
        </p>
      )}
    </CardHeader>
  );
}

TaskCardHeader.displayName = "TaskCardHeader";

const styles = {
  headerRow: "flex items-center justify-between gap-4",
  title: "font-semibold text-text-primary flex-1",
  status: "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
  statusTodo: "bg-action-info/10 text-action-info",
  statusInProgress: "bg-action-primary/10 text-action-primary",
  statusDone: "bg-action-success/10 text-action-success",
  description: "text-text-secondary mt-2",
} as const;
