"use client";

import { Button } from "@/components/ui/button";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { Task } from "@/models/Task";
import { Check, Play, Square } from "lucide-react";

export interface TaskCardFocusActionsProps {
  /** Task data */
  task: Task;
  
  /** Whether the timer is active for this task */
  isActive: boolean;
  
  /** Whether the timer is running */
  isRunning: boolean;
  
  /** Whether there is already an active task (to disable start button) */
  hasActiveTask: boolean;
  
  /** Whether the break timer is running for this task */
  isBreakRunning?: boolean;
  
  /** Callback to start focus session */
  onStartFocus: () => void;
  
  /** Callback to stop timer (ends focus and returns task to To Do) */
  onStop: () => void;
  
  /** Callback to complete task (marks as done and stops timer) */
  onComplete: () => void;
  
  /** Test ID prefix for testing */
  "data-testid"?: string;
}

/**
 * TaskCardFocusActions Component - MindEase
 * Displays focus-related action buttons (start, stop, complete)
 * 
 * Note: Pause/resume actions are not available during focus sessions
 * to maintain cognitive accessibility and prevent micro-interruptions.
 * The focus session must complete before offering a break.
 * 
 * During focus, only essential actions are available:
 * - Stop focus (returns task to To Do)
 * - Complete task (marks as done)
 */
export function TaskCardFocusActions({
  task,
  isActive,
  isRunning,
  hasActiveTask,
  isBreakRunning = false,
  onStartFocus,
  onStop,
  onComplete,
  "data-testid": testId,
}: TaskCardFocusActionsProps) {
  const { getText } = useTextDetail();

  // During break, show only stop button (end focus)
  if (isBreakRunning) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={onStop}
        aria-label={getText("tasks_action_stop_aria")}
        data-testid={testId || `task-card-stop-break-${task.id}`}
      >
        <Button.Icon icon={Square} position="left" />
        <Button.Text>
          {getText("tasks_action_stop")}
        </Button.Text>
      </Button>
    );
  }

  // Show start button when not active
  if (!isActive) {
    // Disable start button if there's already an active task
    const isDisabled = hasActiveTask;
    
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={onStartFocus}
        disabled={isDisabled}
        aria-label={getText("tasks_action_start_focus_aria")}
        aria-disabled={isDisabled}
        data-testid={testId || `task-card-start-focus-${task.id}`}
      >
        <Button.Icon icon={Play} position="left" />
        <Button.Text>
          {getText("tasks_action_start_focus")}
        </Button.Text>
      </Button>
    );
  }

  // Show stop and complete buttons when running (no pause allowed during focus)
  if (isRunning) {
    return (
      <>
        <Button
          variant="secondary"
          size="sm"
          onClick={onStop}
          aria-label={getText("tasks_action_stop_aria")}
          data-testid={testId || `task-card-stop-${task.id}`}
        >
          <Button.Icon icon={Square} position="left" />
          <Button.Text>
            {getText("tasks_action_stop")}
          </Button.Text>
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onComplete}
          aria-label={getText("tasks_action_finish_aria")}
          data-testid={testId || `task-card-complete-${task.id}`}
        >
          <Button.Icon icon={Check} position="left" />
          <Button.Text>
            {getText("tasks_action_finish")}
          </Button.Text>
        </Button>
      </>
    );
  }

  return null;
}

TaskCardFocusActions.displayName = "TaskCardFocusActions";
