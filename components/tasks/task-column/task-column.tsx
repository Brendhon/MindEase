"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import type { Task } from "@/models/Task";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { TaskCard } from "../task-card";

/**
 * TaskColumn Component - MindEase
 * Column for tasks in Kanban layout
 */
export interface TaskColumnProps {
  /** Column title key */
  titleKey: AccessibilityTextKey;

  /** Tasks to display in this column */
  tasks: Task[];

  /** Column status filter (0 = To Do, 1 = In Progress, 2 = Done) */
  status: number;

  /** Callback when task is edited */
  onEdit?: (task: Task) => void;

  /** Callback when task is deleted */
  onDelete?: (taskId: string) => void;

  /** Callback when task status changes */
  onStatusChange?: (taskId: string, status: number) => void;

  /** Callback when subtask is toggled */
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskColumn({
  titleKey,
  tasks,
  status,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  "data-testid": testId,
}: TaskColumnProps) {
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  // Sort tasks: most recent first for To Do and Done, active first for In Progress
  const sortedTasks = useMemo(() => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tasks, status]);

  const columnClasses = useMemo(
    () => cn(styles.column, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const headerClasses = useMemo(
    () => cn(styles.header, spacingClasses.padding),
    [spacingClasses.padding]
  );

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const countClasses = useMemo(
    () => cn(styles.count, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <div className={columnClasses} data-testid={testId || `task-column-${status}`}>
      <div className={headerClasses}>
        <h2 className={titleClasses}>
          {getText(titleKey)}
        </h2>
        <span className={countClasses} aria-label={`${sortedTasks.length} tarefas`}>
          {sortedTasks.length}
        </span>
      </div>
      <div className={contentClasses}>
        {sortedTasks.length === 0 ? (
          <div className={styles.empty} data-testid={`${testId || `task-column-${status}`}-empty`}>
            <p className={cn(styles.emptyText, fontSizeClasses.sm)}>
              {getText("tasks_empty")}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onToggleSubtask={onToggleSubtask}
              data-testid={`task-column-item-${task.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

TaskColumn.displayName = "TaskColumn";

const styles = {
  column: "flex flex-col min-h-[400px] lg:h-full min-w-[280px] lg:min-w-0",
  header: "flex items-center justify-between mb-4 sticky top-0 bg-bg-secondary z-10 pb-2 border-b border-border-subtle",
  title: "font-semibold text-text-primary",
  count: "px-2 py-1 rounded-full bg-action-info/10 text-action-info font-medium min-w-[2rem] text-center",
  content: "flex flex-col flex-1 gap-4 min-h-0 pb-4",
  empty: "flex items-center justify-center py-8 text-center",
  emptyText: "text-text-secondary",
} as const;
