"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import type { Task } from "@/models/Task";
import { TaskColumn } from "../task-column";

/**
 * TaskList Component - MindEase
 * Kanban board with columns for tasks
 */
export interface TaskListProps {
  /** Array of tasks to display */
  tasks: Task[];
  
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

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  "data-testid": testId,
}: TaskListProps) {
  const { spacingClasses, textDetail } = useCognitiveSettings();

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Check if all columns are empty
  const hasTasks = tasks.length > 0;

  if (!hasTasks) {
    return (
      <div className={styles.empty} data-testid={`${testId || "task-list"}-empty`}>
        <p className={styles.emptyText}>
          {textDetail.getText("tasks_empty" as AccessibilityTextKey)}
        </p>
        <p className={styles.emptyDescription}>
          {textDetail.getText("tasks_empty_description" as AccessibilityTextKey)}
        </p>
      </div>
    );
  }

  return (
    <div className={containerClasses} data-testid={testId || "task-list"}>
      {/* To Do Column */}
      <TaskColumn
        titleKey="tasks_column_todo"
        tasks={tasks}
        status={0}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onToggleSubtask={onToggleSubtask}
        data-testid="task-column-todo"
      />

      {/* In Progress Column */}
      <TaskColumn
        titleKey="tasks_column_in_progress"
        tasks={tasks}
        status={1}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onToggleSubtask={onToggleSubtask}
        data-testid="task-column-in-progress"
      />

      {/* Done Column */}
      <TaskColumn
        titleKey="tasks_column_done"
        tasks={tasks}
        status={2}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onToggleSubtask={onToggleSubtask}
        data-testid="task-column-done"
      />
    </div>
  );
}

TaskList.displayName = "TaskList";

const styles = {
  container: "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full auto-rows-min overflow-x-auto lg:overflow-x-visible",
  empty: "flex flex-col items-center justify-center py-12 text-center col-span-full",
  emptyText: "text-text-primary text-lg font-semibold mb-2",
  emptyDescription: "text-text-secondary",
} as const;
