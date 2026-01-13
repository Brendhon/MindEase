/**
 * Task Utilities - MindEase
 * Utility functions for task operations
 */

import type { Task, Subtask } from "@/models/Task";

/**
 * Check if a task has pending (incomplete) subtasks
 * @param task - Task to check
 * @returns true if task has pending subtasks, false otherwise
 */
export function hasPendingSubtasks(task: Task): boolean {
  if (!task.subtasks || task.subtasks.length === 0) {
    return false;
  }
  return task.subtasks.some((subtask) => !subtask.completed);
}

/**
 * Get list of pending (incomplete) subtasks from a task
 * @param task - Task to get pending subtasks from
 * @returns Array of pending subtasks
 */
export function getPendingSubtasks(task: Task): Subtask[] {
  if (!task.subtasks) return [];
  return task.subtasks.filter((subtask) => !subtask.completed);
}

/**
 * Check if a task can be completed (no pending subtasks)
 * @param task - Task to check
 * @returns true if task can be completed, false if it has pending subtasks
 */
export function canCompleteTask(task: Task): boolean {
  return !hasPendingSubtasks(task);
}
