"use client";

import { Task } from "@/models/Task";
import { TaskChecklist } from "@/components/tasks/task-checklist";
import { Button } from "@/components/ui/button";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useFeedback } from "@/hooks/useFeedback";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Play, Pause, Square, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/ui";

/**
 * Task Card Component - MindEase
 * Accessible task card with intelligent checklist and focus timer
 */
export interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onStartFocus?: (taskId: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, onToggleSubtask, onStartFocus }: TaskCardProps) {
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime } = useFocusTimer();
  const { success } = useFeedback();
  const { fontSizeClasses, spacingClasses } = useCognitiveSettings();

  const isCompleted = task.status === 2;
  const isTimerActive = timerState.activeTaskId === task.id;
  const isTimerRunning = isTimerActive && timerState.timerState === "running";
  const isTimerPaused = isTimerActive && timerState.timerState === "paused";

  const handleToggle = () => {
    console.log("Task toggled:", task);
    onToggle?.(task.id);
  };

  const handleStartFocus = () => {
    startTimer(task.id, undefined);
    onStartFocus?.(task.id);
  };

  const handlePauseFocus = () => {
    pauseTimer();
  };

  const handleResumeFocus = () => {
    resumeTimer();
  };

  const handleStopFocus = () => {
    stopTimer();
  };

  const handleToggleSubtaskLocal = (subtaskId: string) => {
    onToggleSubtask?.(task.id, subtaskId);
    
    // Cognitive feedback on completion
    const subtask = task.subtasks?.find((st) => st.id === subtaskId);
    if (subtask && !subtask.completed) {
      const completedCount = (task.subtasks?.filter((st) => st.completed).length || 0) + 1;
      const totalCount = task.subtasks?.length || 0;
      
      if (completedCount === totalCount) {
        success("toast_success_done");
      } else {
        // Light feedback for partial completion
        console.log(`Boa! Um passo concluído. (${completedCount}/${totalCount})`);
      }
    }
  };

  return (
    <div className={cn("p-4 rounded-md border border-border-subtle bg-surface-primary", isTimerActive && "ring-2 ring-action-primary/20")} data-testid={`task-card-${task.id}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="mt-1 h-4 w-4 rounded border-border-subtle text-action-primary focus:ring-2 focus:ring-action-primary"
          aria-label={`Mark task "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
          data-testid={`task-card-checkbox-${task.id}`}
        />
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-medium text-text-primary", fontSizeClasses.base, isCompleted && "line-through text-text-tertiary")} data-testid={`task-card-title-${task.id}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn("mt-1 text-text-secondary", fontSizeClasses.sm)} data-testid={`task-card-description-${task.id}`}>
              {task.description}
            </p>
          )}

          {/* Checklist */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3">
              <TaskChecklist
                subtasks={task.subtasks}
                onToggleSubtask={handleToggleSubtaskLocal}
                focusedSubtaskId={isTimerActive ? timerState.focusedSubtaskId : null}
              />
            </div>
          )}

          {/* Timer Controls */}
          <div className={cn("mt-3 flex items-center gap-2", spacingClasses.gap)}>
            {!isTimerActive ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartFocus}
                disabled={isCompleted}
                data-testid={`task-card-button-start-focus-${task.id}`}
              >
                <Button.Icon icon={Play} position="left" size="sm" />
                <Button.Text>Iniciar foco</Button.Text>
              </Button>
            ) : (
              <>
                {/* Timer display */}
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded bg-surface-secondary", fontSizeClasses.sm)}>
                  <span className="text-text-secondary">Sessão de foco:</span>
                  <span className="font-mono font-semibold text-text-primary" data-testid={`task-card-timer-${task.id}`}>
                    {formatTime(timerState.remainingTime)}
                  </span>
                </div>

                {/* Control buttons */}
                {isTimerRunning ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePauseFocus}
                    data-testid={`task-card-button-pause-${task.id}`}
                  >
                    <Button.Icon icon={Pause} position="left" size="sm" />
                    <Button.Text>Pausar</Button.Text>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleResumeFocus}
                    data-testid={`task-card-button-resume-${task.id}`}
                  >
                    <Button.Icon icon={Play} position="left" size="sm" />
                    <Button.Text>Continuar</Button.Text>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStopFocus}
                  data-testid={`task-card-button-stop-${task.id}`}
                >
                  <Button.Icon icon={Square} position="left" size="sm" />
                  <Button.Text>Finalizar</Button.Text>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className={cn("text-action-primary hover:text-action-primary-hover", fontSizeClasses.sm)}
              aria-label={`Edit task "${task.title}"`}
              data-testid={`task-card-button-edit-${task.id}`}
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className={cn("text-feedback-error hover:text-feedback-error/80", fontSizeClasses.sm)}
              aria-label={`Delete task "${task.title}"`}
              data-testid={`task-card-button-delete-${task.id}`}
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

