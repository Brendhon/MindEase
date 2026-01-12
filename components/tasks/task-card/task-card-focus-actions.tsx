"use client";

import { Button } from "@/components/ui/button";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Play, Pause, Check, Square } from "lucide-react";
import type { Task } from "@/models/Task";

export interface TaskCardFocusActionsProps {
  /** Task data */
  task: Task;
  
  /** Whether the timer is active for this task */
  isActive: boolean;
  
  /** Whether the timer is running */
  isRunning: boolean;
  
  /** Whether the timer is paused */
  isPaused: boolean;
  
  /** Callback to start focus session */
  onStartFocus: () => void;
  
  /** Callback to pause timer */
  onPause: () => void;
  
  /** Callback to resume timer */
  onResume: () => void;
  
  /** Callback to stop timer */
  onStop: () => void;
  
  /** Callback to complete task */
  onComplete: () => void;
  
  /** Test ID prefix for testing */
  "data-testid"?: string;
}

/**
 * TaskCardFocusActions Component - MindEase
 * Displays focus-related action buttons (start, pause, resume, stop, complete)
 */
export function TaskCardFocusActions({
  task,
  isActive,
  isRunning,
  isPaused,
  onStartFocus,
  onPause,
  onResume,
  onStop,
  onComplete,
  "data-testid": testId,
}: TaskCardFocusActionsProps) {
  const { textDetail } = useCognitiveSettings();

  // Show start button when not active
  if (!isActive) {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={onStartFocus}
        aria-label={textDetail.getText("tasks_action_start_focus_aria")}
        data-testid={testId || `task-card-start-focus-${task.id}`}
      >
        <Button.Icon icon={Play} position="left" />
        <Button.Text>
          {textDetail.getText("tasks_action_start_focus")}
        </Button.Text>
      </Button>
    );
  }

  // Show pause and complete buttons when running
  if (isRunning) {
    return (
      <>
        <Button
          variant="secondary"
          size="sm"
          onClick={onPause}
          aria-label={textDetail.getText("tasks_action_pause_aria")}
          data-testid={testId || `task-card-pause-${task.id}`}
        >
          <Button.Icon icon={Pause} position="left" />
          <Button.Text>
            {textDetail.getText("tasks_action_pause")}
          </Button.Text>
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onComplete}
          aria-label={textDetail.getText("tasks_action_finish_aria")}
          data-testid={testId || `task-card-complete-${task.id}`}
        >
          <Button.Icon icon={Check} position="left" />
          <Button.Text>
            {textDetail.getText("tasks_action_finish")}
          </Button.Text>
        </Button>
      </>
    );
  }

  // Show resume and stop buttons when paused
  if (isPaused) {
    return (
      <>
        <Button
          variant="primary"
          size="sm"
          onClick={onResume}
          aria-label={textDetail.getText("tasks_action_resume_aria")}
          data-testid={testId || `task-card-resume-${task.id}`}
        >
          <Button.Icon icon={Play} position="left" />
          <Button.Text>
            {textDetail.getText("tasks_action_resume")}
          </Button.Text>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onStop}
          aria-label={textDetail.getText("tasks_action_stop_aria")}
          data-testid={testId || `task-card-stop-${task.id}`}
        >
          <Button.Icon icon={Square} position="left" />
          <Button.Text>
            {textDetail.getText("tasks_action_stop")}
          </Button.Text>
        </Button>
      </>
    );
  }

  return null;
}

TaskCardFocusActions.displayName = "TaskCardFocusActions";
