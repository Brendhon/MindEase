"use client";

import { useMemo } from "react";
import { Task } from "@/models/Task";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { TaskCard } from "@/components/tasks/task-card";
import { Card } from "@/components/ui/card";
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

  const countClasses = useMemo(
    () => cn(styles.count, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <Card 
      className={styles.container}
      data-testid={testId || `tasks-column-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Card.Header className={styles.header}>
        <Card.Title data-testid={testId ? `${testId}-title` : `tasks-column-title-${title}`}>
          {title}
        </Card.Title>
        <span className={countClasses} data-testid={testId ? `${testId}-count` : `tasks-column-count-${title}`}>
          {tasks.length}
        </span>
      </Card.Header>
      <Card.Content 
        className={styles.content}
        role="list" 
        data-testid={testId ? `${testId}-content` : `tasks-column-content-${title}`}
      >
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
      </Card.Content>
    </Card>
  );
}

TasksColumn.displayName = "TasksColumn";

/**
 * TasksColumn Styles - MindEase
 * Centralized styles for tasks column component
 */

export const styles = {
  container: "min-h-[400px]",
  header: "flex items-center justify-between pb-3",
  count: "text-text-secondary bg-surface-secondary px-2 py-1 rounded-full",
  content: "flex-1",
  empty: "flex items-center justify-center flex-1 py-8",
  emptyText: "text-text-secondary text-center",
} as const;

