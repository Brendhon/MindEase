"use client";

import { useMemo } from "react";
import { Task } from "@/models/Task";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/utils/ui";

/**
 * TasksColumn Component - MindEase
 * Individual column in the kanban board
 */
export interface TasksColumnProps {
  /** Column title */
  title: string;
  
  /** Tasks in this column */
  tasks: Task[];
  
  /** Handler for toggling task completion */
  onToggle?: (id: string) => void;
  
  /** Handler for editing task */
  onEdit?: (task: Task) => void;
  
  /** Handler for deleting task */
  onDelete?: (id: string) => void;
  
  /** Handler for toggling subtask completion */
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  
  /** Handler for starting focus timer */
  onStartFocus?: (taskId: string) => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksColumn({
  title,
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onToggleSubtask,
  onStartFocus,
  "data-testid": testId,
}: TasksColumnProps) {
  const { fontSizeClasses, spacingClasses, textDetail } = useCognitiveSettings();

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.lg),
    [fontSizeClasses.lg]
  );

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const countClasses = useMemo(
    () => cn(styles.count, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <div className={containerClasses} data-testid={testId || `tasks-column-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className={styles.header}>
        <h2 className={titleClasses} data-testid={testId ? `${testId}-title` : `tasks-column-title-${title}`}>
          {title}
        </h2>
        <span className={countClasses} data-testid={testId ? `${testId}-count` : `tasks-column-count-${title}`}>
          {tasks.length}
        </span>
      </div>
      <div className={cn(styles.content, spacingClasses.gap)} role="list" data-testid={testId ? `${testId}-content` : `tasks-column-content-${title}`}>
        {tasks.length === 0 ? (
          <div className={styles.empty} data-testid={testId ? `${testId}-empty` : `tasks-column-empty-${title}`}>
            <p className={cn(styles.emptyText, fontSizeClasses.sm)}>
              {textDetail.getText("empty_state")}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskCard
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleSubtask={onToggleSubtask}
                onStartFocus={onStartFocus}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

TasksColumn.displayName = "TasksColumn";

/**
 * TasksColumn Styles - MindEase
 * Centralized styles for tasks column component
 */

export const styles = {
  container: "flex flex-col bg-surface-primary border border-border-subtle rounded-lg min-h-[400px]",
  header: "flex items-center justify-between border-b border-border-subtle pb-3",
  title: "font-semibold text-text-primary",
  count: "text-text-secondary bg-surface-secondary px-2 py-1 rounded-full",
  content: "flex flex-col flex-1",
  empty: "flex items-center justify-center flex-1 py-8",
  emptyText: "text-text-secondary text-center",
} as const;

