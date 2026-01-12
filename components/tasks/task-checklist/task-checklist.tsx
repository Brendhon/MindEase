"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { Check } from "lucide-react";
import type { Subtask } from "@/models/Task";

/**
 * TaskChecklist Component - MindEase
 * Displays checklist of subtasks with completion status
 */
export interface TaskChecklistProps {
  /** Array of subtasks */
  subtasks: Subtask[];
  
  /** ID of focused subtask (if any) */
  focusedSubtaskId?: string | null;
  
  /** Callback when subtask is toggled */
  onToggleSubtask?: (subtaskId: string) => void;
  
  /** Whether checklist is interactive */
  interactive?: boolean;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskChecklist({
  subtasks,
  focusedSubtaskId,
  onToggleSubtask,
  interactive = false,
  "data-testid": testId,
}: TaskChecklistProps) {
  const { fontSizeClasses, spacingClasses, textDetail } = useCognitiveSettings();

  // Sort subtasks by order
  const sortedSubtasks = useMemo(() => {
    return [...subtasks].sort((a, b) => a.order - b.order);
  }, [subtasks]);

  // Calculate progress
  const completedCount = useMemo(() => {
    return subtasks.filter((st) => st.completed).length;
  }, [subtasks]);

  const totalCount = subtasks.length;

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const progressText = useMemo(() => {
    return `${completedCount} ${textDetail.getText("tasks_progress")} ${totalCount} ${textDetail.getText("tasks_progress_steps")}`;
  }, [completedCount, totalCount, textDetail]);

  if (subtasks.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses} data-testid={testId || "task-checklist"}>
      <p className={cn(styles.progress, fontSizeClasses.sm)}>
        {progressText}
      </p>
      <ul className={styles.list} role="list">
        {sortedSubtasks.map((subtask) => {
          const isFocused = focusedSubtaskId === subtask.id;
          const isCompleted = subtask.completed;

          return (
            <li
              key={subtask.id}
              className={cn(
                styles.item,
                isFocused && styles.itemFocused,
                isCompleted && styles.itemCompleted,
                !interactive && styles.itemNonInteractive
              )}
              data-testid={`task-checklist-item-${subtask.id}`}
            >
              <button
                type="button"
                onClick={() => interactive && onToggleSubtask?.(subtask.id)}
                disabled={!interactive}
                className={styles.button}
                aria-checked={isCompleted}
                role="checkbox"
                aria-label={`${subtask.title} - ${isCompleted ? "Concluída" : "Pendente"}`}
              >
                <div
                  className={cn(
                    styles.checkbox,
                    isCompleted && styles.checkboxCompleted
                  )}
                >
                  {isCompleted && <Check className={styles.checkIcon} size={14} />}
                </div>
                <span className={cn(styles.label, fontSizeClasses.sm)}>
                  {subtask.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

TaskChecklist.displayName = "TaskChecklist";

const styles = {
  container: "flex flex-col",
  progress: "text-text-secondary mb-2",
  list: "flex flex-col list-none p-0 m-0",
  item: "flex items-start",
  itemFocused: "opacity-100",
  itemCompleted: "opacity-60",
  itemNonInteractive: "pointer-events-none",
  button: "flex items-center gap-2 w-full text-left bg-transparent border-none p-0 cursor-pointer disabled:cursor-default",
  checkbox: "flex items-center justify-center w-5 h-5 border-2 border-text-secondary rounded flex-shrink-0 transition-colors",
  checkboxCompleted: "bg-action-success border-action-success",
  checkIcon: "text-white",
  label: "text-text-primary",
} as const;
