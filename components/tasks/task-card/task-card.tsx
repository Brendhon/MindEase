import { Task } from "@/models/Task";

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
  return (
    <div className="p-4 rounded-md border border-border-subtle bg-surface-primary">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle?.(task.id)}
          className="mt-1 h-4 w-4 rounded border-border-subtle text-action-primary focus:ring-2 focus:ring-action-primary"
          aria-label={`Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
        <div className="flex-1">
          <h3 className={`font-medium text-text-primary ${task.completed ? "line-through text-text-tertiary" : ""}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-text-secondary">{task.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-action-primary hover:text-action-primary-hover"
              aria-label={`Edit task "${task.title}"`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-feedback-error hover:text-feedback-error/80"
              aria-label={`Delete task "${task.title}"`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

