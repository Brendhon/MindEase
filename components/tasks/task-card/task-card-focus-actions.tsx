'use client';

import { Button } from '@/components/ui/button';
import { useTextDetail } from '@/hooks/accessibility';
import type { TaskCardFocusActionsProps } from '@/models/task-card-props';
import { AccessibilityTextKey } from '@/utils/accessibility';
import { Check, LucideIcon, Play, Square } from 'lucide-react';

interface StopButtonProps {
  onStop: () => void;
  testId: string;
}

interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: AccessibilityTextKey;
  ariaDisabled?: boolean;
  testId: string;
  icon: LucideIcon;
  textKey: AccessibilityTextKey;
}

const StopButton = ({ onStop, testId }: StopButtonProps) => {
  const { getText } = useTextDetail();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onStop}
      aria-label={getText('tasks_action_stop_aria')}
      data-testid={testId}
    >
      <Button.Icon icon={Square} position="left" />
      <Button.Text>{getText('tasks_action_stop')}</Button.Text>
    </Button>
  );
};

const PrimaryButton = ({
  onClick,
  disabled = false,
  ariaLabel,
  ariaDisabled = false,
  testId,
  icon,
  textKey,
}: PrimaryButtonProps) => {
  const { getText } = useTextDetail();
  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onClick}
      aria-label={getText(ariaLabel)}
      aria-disabled={ariaDisabled}
      data-testid={testId}
      disabled={disabled}
    >
      <Button.Icon icon={icon} position="left" />
      <Button.Text>{getText(textKey)}</Button.Text>
    </Button>
  );
};

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
  isRunning,
  hasActiveTask,
  isBreakRunning = false,
  onStartFocus,
  onStop,
  onComplete,
  'data-testid': testId,
}: TaskCardFocusActionsProps) {
  // During break, show only stop button (end focus)
  if (isBreakRunning) {
    return (
      <StopButton
        onStop={onStop}
        testId={testId || `task-card-stop-break-${task.id}`}
      />
    );
  }

  // Show stop and complete buttons when running (no pause allowed during focus)
  if (isRunning) {
    return (
      <>
        <StopButton
          onStop={onStop}
          testId={testId || `task-card-stop-${task.id}`}
        />
        <PrimaryButton
          onClick={onComplete}
          ariaLabel="tasks_action_finish_aria"
          testId={testId || `task-card-complete-${task.id}`}
          icon={Check}
          textKey="tasks_action_finish"
        />
      </>
    );
  }

  // Disable start button if there's already an active task
  const isDisabled = hasActiveTask;

  // Show start button when not active
  return (
    <PrimaryButton
      onClick={onStartFocus}
      disabled={isDisabled}
      ariaLabel="tasks_action_start_focus_aria"
      testId={testId || `task-card-start-focus-${task.id}`}
      icon={Play}
      textKey="tasks_action_start_focus"
    />
  );
}

TaskCardFocusActions.displayName = 'TaskCardFocusActions';
