"use client";

import { CardHeader } from "@/components/ui/card/card-header";
import { CardTitle } from "@/components/ui/card/card-title";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import type { TaskCardHeaderProps } from "@/models/task-card-props";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { styles } from "./task-card-styles";

/**
 * TaskCardHeader Component - MindEase
 * Displays task title, status badge, and description
 */
export function TaskCardHeader({
  task,
  "data-testid": testId,
}: TaskCardHeaderProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  // Get status label
  const statusLabel = useMemo(() => {
    switch (task.status) {
      case 0:
        return getText("tasks_status_todo");
      case 1:
        return getText("tasks_status_in_progress");
      default:
        return getText("tasks_status_done");
    }
  }, [task.status, getText]);

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