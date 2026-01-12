"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card/card-header";
import { CardTitle } from "@/components/ui/card/card-title";
import { CardContent } from "@/components/ui/card/card-content";
import { Button } from "@/components/ui/button";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFocusTimer } from "@/contexts/focus-timer-context";
import { cn } from "@/utils/ui";
import { Play, Pause, Check, Edit, Trash2, Square } from "lucide-react";
import type { Task } from "@/models/Task";
import { TaskChecklist } from "../task-checklist";

/**
 * TaskCard Component - MindEase
 * Individual task card with actions and status
 */
export interface TaskCardProps {
  /** Task data */
  task: Task;
  
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

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  "data-testid": testId,
}: TaskCardProps) {
  const { fontSizeClasses, spacingClasses, textDetail } = useCognitiveSettings();
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer } = useFocusTimer();

  const isActive = timerState.activeTaskId === task.id;
  const isRunning = isActive && timerState.timerState === "running";
  const isPaused = isActive && timerState.timerState === "paused";

  // Get status label
  const statusLabel = useMemo(() => {
    if (task.status === 0) return textDetail.getText("tasks_status_todo");
    if (task.status === 1) return textDetail.getText("tasks_status_in_progress");
    return textDetail.getText("tasks_status_done");
  }, [task.status, textDetail]);

  // Handle focus actions
  const handleStartFocus = () => {
    if (task.subtasks && task.subtasks.length > 0) {
      // If task has subtasks, start with first incomplete one or first one
      const firstIncomplete = task.subtasks.find((st) => !st.completed);
      const subtaskId = firstIncomplete?.id || task.subtasks[0]?.id;
      startTimer(task.id, subtaskId);
    } else {
      startTimer(task.id);
    }
    onStatusChange?.(task.id, 1); // Set to In Progress
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleStop = () => {
    stopTimer();
  };

  const handleComplete = () => {
    stopTimer();
    onStatusChange?.(task.id, 2); // Set to Done
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    onToggleSubtask?.(task.id, subtaskId);
  };

  // Card classes based on status and focus state
  const cardClasses = useMemo(() => {
    if (task.status === 2) return styles.cardDone;
    if (isActive) return styles.cardActive;
    return styles.cardDefault;
  }, [task.status, isActive]);

  // Determine which actions to show
  const showActions = task.status !== 2; // Don't show actions for completed tasks

  return (
    <Card className={cardClasses} data-testid={testId || `task-card-${task.id}`}>
      <CardHeader>
        <div className={styles.headerRow}>
          <CardTitle className={cn(fontSizeClasses.base, styles.title)}>
            {task.title}
          </CardTitle>
          <span
            className={cn(
              styles.status,
              fontSizeClasses.sm,
              task.status === 0 && styles.statusTodo,
              task.status === 1 && styles.statusInProgress,
              task.status === 2 && styles.statusDone
            )}
            data-testid={`task-card-status-${task.id}`}
          >
            {statusLabel}
          </span>
        </div>
        {task.description && (
          <p className={cn(styles.description, fontSizeClasses.sm)}>
            {task.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {/* Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <TaskChecklist
            subtasks={task.subtasks}
            focusedSubtaskId={isActive ? timerState.focusedSubtaskId : null}
            onToggleSubtask={showActions ? handleToggleSubtask : undefined}
            interactive={showActions}
            data-testid={`task-card-checklist-${task.id}`}
          />
        )}

        {/* Actions */}
        {showActions && (
          <div className={cn(styles.actions, spacingClasses.gap)}>
            {/* Focus controls */}
            {!isActive && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartFocus}
                aria-label={textDetail.getText("tasks_action_start_focus_aria")}
                data-testid={`task-card-start-focus-${task.id}`}
              >
                <Button.Icon icon={Play} position="left" />
                <Button.Text>
                  {textDetail.getText("tasks_action_start_focus")}
                </Button.Text>
              </Button>
            )}

            {isActive && isRunning && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePause}
                  aria-label={textDetail.getText("tasks_action_pause_aria")}
                  data-testid={`task-card-pause-${task.id}`}
                >
                  <Button.Icon icon={Pause} position="left" />
                  <Button.Text>
                    {textDetail.getText("tasks_action_pause")}
                  </Button.Text>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleComplete}
                  aria-label={textDetail.getText("tasks_action_finish_aria")}
                  data-testid={`task-card-complete-${task.id}`}
                >
                  <Button.Icon icon={Check} position="left" />
                  <Button.Text>
                    {textDetail.getText("tasks_action_finish")}
                  </Button.Text>
                </Button>
              </>
            )}

            {isActive && isPaused && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResume}
                  aria-label={textDetail.getText("tasks_action_resume_aria")}
                  data-testid={`task-card-resume-${task.id}`}
                >
                  <Button.Icon icon={Play} position="left" />
                  <Button.Text>
                    {textDetail.getText("tasks_action_resume")}
                  </Button.Text>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleStop}
                  aria-label={textDetail.getText("tasks_action_pause_aria")}
                  data-testid={`task-card-stop-${task.id}`}
                >
                  <Button.Icon icon={Square} position="left" />
                  <Button.Text>
                    {textDetail.getText("tasks_action_pause")}
                  </Button.Text>
                </Button>
              </>
            )}

            {/* Edit and Delete */}
            {!isActive && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  aria-label={textDetail.getText("tasks_action_edit_aria")}
                  data-testid={`task-card-edit-${task.id}`}
                >
                  <Button.Icon icon={Edit} position="left" />
                  <Button.Text>
                    {textDetail.getText("tasks_action_edit")}
                  </Button.Text>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  aria-label={textDetail.getText("tasks_action_delete_aria")}
                  data-testid={`task-card-delete-${task.id}`}
                >
                  <Button.Icon icon={Trash2} position="left" />
                  <Button.Text>
                    {textDetail.getText("tasks_action_delete")}
                  </Button.Text>
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

TaskCard.displayName = "TaskCard";

const styles = {
  cardDefault: "",
  cardActive: "ring-2 ring-action-primary",
  cardDone: "opacity-60",
  headerRow: "flex items-center justify-between gap-4",
  title: "font-semibold text-text-primary flex-1",
  status: "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
  statusTodo: "bg-action-info/10 text-action-info",
  statusInProgress: "bg-action-primary/10 text-action-primary",
  statusDone: "bg-action-success/10 text-action-success",
  description: "text-text-secondary mt-2",
  actions: "flex flex-wrap items-center gap-2 mt-4",
} as const;
