/**
 * Task Mocks - Centralized test fixtures for tasks
 * Reusable mock factories for Task and Subtask entities
 */

import type { Task, Subtask } from '@/models/task';

/**
 * Creates a mock Task with default values
 * @param overrides - Partial Task object to override defaults
 * @returns A complete Task object
 */
export const createTask = (overrides?: Partial<Task>): Task => ({
  id: '1',
  userId: 'user1',
  title: 'Test Task',
  status: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Creates a mock Subtask with default values
 * @param overrides - Partial Subtask object to override defaults
 * @returns A complete Subtask object
 */
export const createSubtask = (overrides?: Partial<Subtask>): Subtask => ({
  id: '1',
  title: 'Subtask',
  completed: false,
  order: 0,
  ...overrides,
});

/**
 * Common task mock variants for testing
 */
export const taskMocks = {
  /**
   * A minimal valid task with only required fields
   */
  minimal: (): Task => createTask({ title: 'My Task' }),

  /**
   * A task with description
   */
  withDescription: (): Task =>
    createTask({
      title: 'My Task',
      description: 'Task description',
    }),

  /**
   * A task with subtasks
   */
  withSubtasks: (): Task =>
    createTask({
      title: 'My Task',
      subtasks: [
        createSubtask({
          id: 'subtask-1',
          title: 'Subtask 1',
          completed: false,
          order: 0,
        }),
        createSubtask({
          id: 'subtask-2',
          title: 'Subtask 2',
          completed: true,
          order: 1,
        }),
      ],
    }),

  /**
   * A completed task (status = 2)
   */
  completed: (): Task => createTask({ title: 'Completed Task', status: 2 }),

  /**
   * A task in progress (status = 1)
   */
  inProgress: (): Task => createTask({ title: 'In Progress Task', status: 1 }),
};

/**
 * Common subtask mock variants for testing
 */
export const subtaskMocks = {
  /**
   * A minimal valid subtask
   */
  minimal: (): Subtask =>
    createSubtask({ id: 'subtask-1', title: 'Subtask', order: 0 }),

  /**
   * A completed subtask
   */
  completed: (): Subtask =>
    createSubtask({
      id: 'subtask-1',
      title: 'Completed Subtask',
      completed: true,
      order: 0,
    }),

  /**
   * A pending subtask
   */
  pending: (): Subtask =>
    createSubtask({
      id: 'subtask-1',
      title: 'Pending Subtask',
      completed: false,
      order: 0,
    }),
};
