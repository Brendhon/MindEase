/**
 * Task Card Styles - MindEase
 * Utility functions for calculating task card styles
 */

import type { Task } from '@/models/task';

/**
 * Card style classes based on task status and focus state
 */
export const styles = {
  cardDefault: 'm-1',
  cardActive: 'm-1 ring-2 ring-action-primary',
  cardDone: 'm-1 opacity-60',
  headerRow: 'flex items-center justify-between gap-4',
  title: 'font-semibold text-text-primary flex-1',
  status: 'px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
  statusTodo: 'bg-action-info/10 text-action-info',
  statusInProgress: 'bg-action-primary/10 text-action-primary',
  statusDone: 'bg-action-success/10 text-action-success',
  description: 'text-text-secondary mt-2',
  actions: 'flex flex-wrap items-center gap-2 mt-3',
  timerIndicator: 'flex flex-col gap-1 mb-4 p-3 rounded-lg border',
  focusTimer: 'bg-action-primary/5 border-action-primary/20',
  breakTimer: 'bg-action-warning/5 border-action-warning/30',
  timerLabel: 'text-text-secondary',
  timerValue: 'font-semibold',
  focusTimerValue: 'text-action-primary',
  breakTimerValue: 'text-action-secondary',
  timerStatus: 'text-text-secondary italic',
} as const;

/**
 * Get card classes based on task status and focus state
 * @param task - Task data
 * @param isFocusActive - Function to check if focus is active for the task
 * @returns CSS classes for the card
 */
export function getTaskCardClasses(
  task: Task,
  isFocusActive: (taskId: string) => boolean
): string {
  switch (true) {
    case task.status === 2:
      return styles.cardDone;
    case isFocusActive(task.id):
      return styles.cardActive;
    default:
      return styles.cardDefault;
  }
}
