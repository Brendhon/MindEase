/**
 * useSyncFocusTimerWithTasks - MindEase
 * Syncs focus timer with remote task changes.
 *
 * When the task in focus is completed or deleted on another device, Firestore
 * updates and tasks sync via onSnapshot. This hook stops the local focus timer
 * when the active task is no longer valid (missing from list or status === 2).
 *
 * Call from FocusTimerProvider with (activeTaskId, stopTimer).
 */
import { useTasks } from '@/hooks/tasks';
import { useEffect } from 'react';

const TASK_STATUS_COMPLETED = 2;

export function useSyncFocusTimerWithTasks(
  activeTaskId: string | null,
  stopTimer: () => void
) {
  const { tasks } = useTasks();

  useEffect(() => {
    if (!activeTaskId) return;
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task || task.status === TASK_STATUS_COMPLETED) {
      stopTimer();
    }
  }, [tasks, activeTaskId, stopTimer]);
}

/**
 * useSyncBreakTimerWithTasks - MindEase
 * Syncs break timer with remote task changes.
 *
 * When the task associated with the break is completed or deleted on another
 * device, this hook stops the local break timer.
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
    if (!task || task.status === TASK_STATUS_COMPLETED) {
      stopBreak();
    }
  }, [tasks, activeTaskId, stopBreak]);
}
