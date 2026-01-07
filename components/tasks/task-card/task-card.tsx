import { Task } from "@/models/Task";
import { useCallback } from "storybook/internal/preview-api";

/**
 * Task Card Component - MindEase
 * Accessible task card with cognitive accessibility features
 */
export interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const handleToggle = () => {
    console.log("Task toggled:", task);
    onToggle?.(task.id);
  };
  return (
    <div className="p-4 rounded-md border border-border-subtle bg-surface-primary" data-testid={`task-card-${task.id}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 h-4 w-4 rounded border-border-subtle text-action-primary focus:ring-2 focus:ring-action-primary"
          aria-label={`Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          data-testid={`task-card-checkbox-${task.id}`}
        />
        <div className="flex-1">
          <h3 className={`font-medium text-text-primary ${task.completed ? "line-through text-text-tertiary" : ""}`} data-testid={`task-card-title-${task.id}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-text-secondary" data-testid={`task-card-description-${task.id}`}>{task.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-action-primary hover:text-action-primary-hover"
              aria-label={`Edit task "${task.title}"`}
              data-testid={`task-card-button-edit-${task.id}`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-feedback-error hover:text-feedback-error/80"
              aria-label={`Delete task "${task.title}"`}
              data-testid={`task-card-button-delete-${task.id}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

