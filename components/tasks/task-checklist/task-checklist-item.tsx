"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import type { Subtask } from "@/models/Task";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * TaskChecklistItem Component - MindEase
 * Individual checklist item with checkbox
 */
export interface TaskChecklistItemProps {
  /** Subtask data */
  subtask: Subtask;

  /** Whether checklist is interactive */
  interactive?: boolean;

  /** Callback when subtask is toggled */
  onToggle?: (subtaskId: string) => void;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskChecklistItem({
  subtask,
  interactive = false,
  onToggle,
  "data-testid": testId,
}: TaskChecklistItemProps) {
  const { fontSizeClasses } = useCognitiveSettings();

  const isCompleted = subtask.completed;

  const itemClasses = useMemo(() => {
    return cn(
      styles.item,
      isCompleted && styles.itemCompleted,
      !interactive && styles.itemNonInteractive
    );
  }, [isCompleted, interactive]);

  const handleToggle = () => {
    // Always call onToggle - the parent component will handle the logic
    // (show dialog if not in focus, or toggle if in focus)
    onToggle?.(subtask.id);
  };

  return (
    <li
      className={itemClasses}
      data-testid={testId || `task-checklist-item-${subtask.id}`}
    >
      <Checkbox
        checked={isCompleted}
        onChange={handleToggle}
        disabled={false}
        aria-label={`${subtask.title} - ${isCompleted ? "Concluída" : "Pendente"}${!interactive ? " - Entre em foco para marcar" : ""}`}
        data-testid={`task-checklist-checkbox-${subtask.id}`}
        className={cn(styles.checkboxWrapper, !interactive && styles.checkboxDisabled)}
      >
        <Checkbox.Label
          checked={isCompleted}
          className={cn(styles.label, fontSizeClasses.sm)}
          onClick={handleToggle}
        >
          {subtask.title}
        </Checkbox.Label>
      </Checkbox>
    </li>
  );
}

TaskChecklistItem.displayName = "TaskChecklistItem";

const styles = {
  item: "flex items-start",
  itemCompleted: "opacity-60",
  itemNonInteractive: "opacity-70",
  checkboxWrapper: "w-full",
  checkboxDisabled: "cursor-pointer",
  label: "text-text-primary",
} as const;
