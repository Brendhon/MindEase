"use client";

import { useMemo } from "react";
import { Task } from "@/models/Task";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { TasksColumn } from "@/components/tasks/tasks-column";
import { cn } from "@/utils/ui";

/**
 * TasksKanban Component - MindEase
 * Simplified kanban board with columns (To Do, In Progress, Done)
 * Tasks are organized by status: 0 = To Do, 1 = In Progress, 2 = Done
 */
export interface TasksKanbanProps {
  /** All tasks */
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

export function TasksKanban({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onToggleSubtask,
  onStartFocus,
  "data-testid": testId,
}: TasksKanbanProps) {
  const { spacingClasses, textDetail } = useCognitiveSettings();

  // Separate tasks by status
  const todoTasks = useMemo(
    () => tasks.filter((task) => task.status === 0),
    [tasks]
  );

  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === 1),
    [tasks]
  );

  const doneTasks = useMemo(
    () => tasks.filter((task) => task.status === 2),
    [tasks]
  );

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <div className={containerClasses} data-testid={testId || "tasks-kanban"}>
      <TasksColumn
        title={textDetail.getText("tasks_column_todo")}
        tasks={todoTasks}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleSubtask={onToggleSubtask}
        onStartFocus={onStartFocus}
        data-testid="tasks-column-todo"
      />
      <TasksColumn
        title={textDetail.getText("tasks_column_in_progress")}
        tasks={inProgressTasks}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleSubtask={onToggleSubtask}
        onStartFocus={onStartFocus}
        data-testid="tasks-column-in-progress"
      />
      <TasksColumn
        title={textDetail.getText("tasks_column_done")}
        tasks={doneTasks}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleSubtask={onToggleSubtask}
        onStartFocus={onStartFocus}
        data-testid="tasks-column-done"
      />
    </div>
  );
}

TasksKanban.displayName = "TasksKanban";

/**
 * TasksKanban Styles - MindEase
 * Centralized styles for tasks kanban component
 */

export const styles = {
  container: "grid grid-cols-1 md:grid-cols-3 gap-4",
} as const;

