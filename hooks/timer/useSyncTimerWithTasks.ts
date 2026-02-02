/**
 * useSyncFocusTimerWithTasks - MindEase
 * Syncs focus timer with remote task changes.
 *
 * When the task in focus is deleted or its status changes away from "in progress"
 * on another device, this hook stops the local focus timer.
 * Only status 1 (in progress) should keep the timer running.
 *
 * Call from FocusTimerProvider with (activeTaskId, stopTimer).
 */
import { useTasks } from '@/hooks/tasks';
import { useEffect } from 'react';

const TASK_STATUS_IN_PROGRESS = 1;

export function useSyncFocusTimerWithTasks(
  activeTaskId: string | null,
  stopTimer: () => void
) {
  const { tasks } = useTasks();

  useEffect(() => {
    if (!activeTaskId) return;
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task || task.status !== TASK_STATUS_IN_PROGRESS) {
      stopTimer();
    }
  }, [tasks, activeTaskId, stopTimer]);
}

/**
 * useSyncBreakTimerWithTasks - MindEase
 * Syncs break timer with remote task changes.
 *
 * When the task associated with the break is deleted or its status changes away
 * from "in progress" on another device, this hook stops the local break timer.
 *
 * Call from BreakTimerProvider with (activeTaskId, stopBreak).
 */
export function useSyncBreakTimerWithTasks(
  activeTaskId: string | null,
  stopBreak: () => void
) {
  const { tasks } = useTasks();

  useEffect(() => {
    if (!activeTaskId) return;
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task || task.status !== TASK_STATUS_IN_PROGRESS) {
      stopBreak();
    }
  }, [tasks, activeTaskId, stopBreak]);
}
