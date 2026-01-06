import { Task } from "@/models/Task";
import { TaskCard } from "../task-card";

/**
 * Task List Component - MindEase
 * Accessible task list with cognitive accessibility features
 */
export interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" role="list">
      {tasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskCard
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

