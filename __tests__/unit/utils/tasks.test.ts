import { describe, it, expect } from 'vitest';
import {
  hasPendingSubtasks,
  getPendingSubtasks,
  canCompleteTask,
} from '@/utils/tasks/tasks';
import { createTask, createSubtask } from '@/__tests__/__mocks__/tasks';

describe('tasks utils', () => {
  describe('hasPendingSubtasks', () => {
    it('should return false when task has no subtasks', () => {
      const task = createTask();
      expect(hasPendingSubtasks(task)).toBe(false);
    });

    it('should return false when task has empty subtasks array', () => {
      const task = createTask({ subtasks: [] });
      expect(hasPendingSubtasks(task)).toBe(false);
    });

    it('should return false when all subtasks are completed', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: true }),
          createSubtask({ id: '2', completed: true }),
        ],
      });
      expect(hasPendingSubtasks(task)).toBe(false);
    });

    it('should return true when task has at least one pending subtask', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: true }),
          createSubtask({ id: '2', completed: false }),
        ],
      });
      expect(hasPendingSubtasks(task)).toBe(true);
    });

    it('should return true when all subtasks are pending', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: false }),
          createSubtask({ id: '2', completed: false }),
        ],
      });
      expect(hasPendingSubtasks(task)).toBe(true);
    });
  });

  describe('getPendingSubtasks', () => {
    it('should return empty array when task has no subtasks', () => {
      const task = createTask();
      expect(getPendingSubtasks(task)).toEqual([]);
    });

    it('should return empty array when task has empty subtasks array', () => {
      const task = createTask({ subtasks: [] });
      expect(getPendingSubtasks(task)).toEqual([]);
    });

    it('should return empty array when all subtasks are completed', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: true }),
          createSubtask({ id: '2', completed: true }),
        ],
      });
      expect(getPendingSubtasks(task)).toEqual([]);
    });

    it('should return only pending subtasks', () => {
      const pending1 = createSubtask({ id: '1', title: 'Pending 1' });
      const completed = createSubtask({
        id: '2',
        title: 'Completed',
        completed: true,
      });
      const pending2 = createSubtask({ id: '3', title: 'Pending 2' });

      const task = createTask({
        subtasks: [pending1, completed, pending2],
      });

      const result = getPendingSubtasks(task);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(pending1);
      expect(result).toContainEqual(pending2);
      expect(result).not.toContainEqual(completed);
    });

    it('should return all subtasks when none are completed', () => {
      const pending1 = createSubtask({ id: '1' });
      const pending2 = createSubtask({ id: '2' });

      const task = createTask({
        subtasks: [pending1, pending2],
      });

      const result = getPendingSubtasks(task);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(pending1);
      expect(result).toContainEqual(pending2);
    });
  });

  describe('canCompleteTask', () => {
    it('should return true when task has no subtasks', () => {
      const task = createTask();
      expect(canCompleteTask(task)).toBe(true);
    });

    it('should return true when task has empty subtasks array', () => {
      const task = createTask({ subtasks: [] });
      expect(canCompleteTask(task)).toBe(true);
    });

    it('should return true when all subtasks are completed', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: true }),
          createSubtask({ id: '2', completed: true }),
        ],
      });
      expect(canCompleteTask(task)).toBe(true);
    });

    it('should return false when task has at least one pending subtask', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: true }),
          createSubtask({ id: '2', completed: false }),
        ],
      });
      expect(canCompleteTask(task)).toBe(false);
    });

    it('should return false when all subtasks are pending', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ id: '1', completed: false }),
          createSubtask({ id: '2', completed: false }),
        ],
      });
      expect(canCompleteTask(task)).toBe(false);
    });
  });
});
