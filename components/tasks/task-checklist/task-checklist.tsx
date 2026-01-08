"use client";

import { useMemo } from "react";
import { Subtask } from "@/models/Task";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * Task Checklist Component - MindEase
 * Intelligent checklist with visual progress indicator
 * 
 * Features:
 * - Visual progress bar
 * - Subtask completion tracking
 * - Cognitive feedback on completion
 */
export interface TaskChecklistProps {
  subtasks: Subtask[];
  onToggleSubtask?: (subtaskId: string) => void;
  focusedSubtaskId?: string | null;
  className?: string;
  "data-testid"?: string;
}

export function TaskChecklist({
  subtasks,
  onToggleSubtask,
  focusedSubtaskId,
  className,
  "data-testid": testId,
}: TaskChecklistProps) {
  const { fontSizeClasses, spacingClasses } = useCognitiveSettings();

  const progress = useMemo(() => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter((st) => st.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  }, [subtasks]);

  const completedCount = useMemo(
    () => subtasks.filter((st) => st.completed).length,
    [subtasks]
  );

  if (subtasks.length === 0) {
    return null;
  }

  const sortedSubtasks = [...subtasks].sort((a, b) => a.order - b.order);

  return (
    <div className={cn(styles.container, spacingClasses.padding, className)} data-testid={testId}>
      {/* Progress indicator */}
      <div className={cn(styles.progressContainer, spacingClasses.gap)}>
        <div className={styles.progressInfo}>
          <span className={cn(styles.progressText, fontSizeClasses.sm)}>
            {completedCount} de {subtasks.length} etapas concluídas
          </span>
        </div>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progress}% concluído`}
          />
        </div>
      </div>

      {/* Subtasks list */}
      <div className={cn(styles.subtasksList, spacingClasses.gap)} role="list">
        {sortedSubtasks.map((subtask) => {
          const isFocused = focusedSubtaskId === subtask.id;
          const isCompleted = subtask.completed;

          return (
            <div
              key={subtask.id}
              className={cn(
                styles.subtaskItem,
                isFocused && styles.subtaskItemFocused,
                isCompleted && styles.subtaskItemCompleted
              )}
              role="listitem"
              data-testid={`subtask-${subtask.id}`}
            >
              <label className={styles.subtaskLabel}>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => onToggleSubtask?.(subtask.id)}
                  className={styles.subtaskCheckbox}
                  aria-label={`Marcar subtarefa "${subtask.title}" como ${isCompleted ? "não concluída" : "concluída"}`}
                  data-testid={`subtask-checkbox-${subtask.id}`}
                />
                <span
                  className={cn(
                    styles.subtaskTitle,
                    fontSizeClasses.sm,
                    isCompleted && styles.subtaskTitleCompleted
                  )}
                >
                  {subtask.title}
                </span>
                {isFocused && (
                  <span className={cn(styles.focusIndicator, fontSizeClasses.xs)}>
                    Focando
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

TaskChecklist.displayName = "TaskChecklist";

/**
 * Task Checklist Styles - MindEase
 */
export const styles = {
  container: "flex flex-col",
  progressContainer: "flex flex-col",
  progressInfo: "flex items-center justify-between",
  progressText: "text-text-secondary",
  progressBarContainer: "h-2 bg-surface-secondary rounded-full overflow-hidden",
  progressBar: "h-full bg-action-primary transition-all duration-300 ease-out",
  subtasksList: "flex flex-col",
  subtaskItem: "flex items-start",
  subtaskItemFocused: "bg-surface-secondary/50 rounded px-2 py-1",
  subtaskItemCompleted: "opacity-75",
  subtaskLabel: "flex items-start gap-2 cursor-pointer flex-1",
  subtaskCheckbox: "mt-0.5 h-4 w-4 rounded border-border-subtle text-action-primary focus:ring-2 focus:ring-action-primary",
  subtaskTitle: "text-text-secondary flex-1",
  subtaskTitleCompleted: "line-through text-text-tertiary",
  focusIndicator: "text-action-primary font-medium",
} as const;
