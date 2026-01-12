"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import type { Subtask } from "@/models/Task";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { TaskChecklistItem } from "./task-checklist-item";
import { TaskChecklistProgress } from "./task-checklist-progress";

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
  const { spacingClasses } = useCognitiveSettings();

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

  if (subtasks.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses} data-testid={testId || "task-checklist"}>
      <TaskChecklistProgress
        completedCount={completedCount}
        totalCount={totalCount}
        data-testid={`${testId || "task-checklist"}-progress`}
      />
      <ul className={styles.list} role="list">
        {sortedSubtasks.map((subtask) => {
          return (
            <TaskChecklistItem
              key={subtask.id}
              subtask={subtask}
              isFocused={focusedSubtaskId === subtask.id}
              interactive={interactive}
              onToggle={onToggleSubtask}
              data-testid={`${testId || "task-checklist"}-item-${subtask.id}`}
            />
          );
        })}
      </ul>
    </div>
  );
}

TaskChecklist.displayName = "TaskChecklist";

const styles = {
  container: "flex flex-col",
  list: "flex flex-col list-none p-0 m-0 gap-2",
} as const;
