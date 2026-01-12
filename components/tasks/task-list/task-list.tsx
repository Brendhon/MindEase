"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import type { Task } from "@/models/Task";
import { TaskCard } from "../task-card";

/**
 * TaskList Component - MindEase
 * List of task cards
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

  // Sort tasks: In Progress first, then To Do, then Done
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // In Progress (status 1) first
      if (a.status === 1 && b.status !== 1) return -1;
      if (b.status === 1 && a.status !== 1) return 1;
      
      // Then To Do (status 0)
      if (a.status === 0 && b.status === 2) return -1;
      if (b.status === 0 && a.status === 2) return 1;
      
      // Then by updated date (most recent first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [tasks]);

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  if (tasks.length === 0) {
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
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleSubtask={onToggleSubtask}
          data-testid={`task-list-item-${task.id}`}
        />
      ))}
    </div>
  );
}

TaskList.displayName = "TaskList";

const styles = {
  container: "flex flex-col",
  empty: "flex flex-col items-center justify-center py-12 text-center",
  emptyText: "text-text-primary text-lg font-semibold mb-2",
  emptyDescription: "text-text-secondary",
} as const;
