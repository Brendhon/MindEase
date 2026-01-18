import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksService } from '@/services/tasks/tasks';
import { firestoreService } from '@/services/firestore/firestore';
import { createTask } from '@/__tests__/__mocks__/tasks';
import type { Task } from '@/models/task';

// Mock firestore service
vi.mock('@/services/firestore/firestore', () => ({
  firestoreService: {
    getCollection: vi.fn(),
    getDocument: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    deleteCollection: vi.fn(),
  },
}));

describe('tasksService', () => {
  const mockUserId = 'user-123';
  const mockTaskId = 'task-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should get all tasks for a user', async () => {
      const mockTasks: Task[] = [
        createTask({ id: 'task-1', userId: mockUserId, title: 'Task 1' }),
        createTask({ id: 'task-2', userId: mockUserId, title: 'Task 2' }),
      ];

      vi.mocked(firestoreService.getCollection).mockResolvedValue(mockTasks);

      const result = await tasksService.getTasks(mockUserId);

      expect(result).toEqual(mockTasks);
      expect(firestoreService.getCollection).toHaveBeenCalledWith(
        `users/${mockUserId}/tasks`
      );
    });

    it('should return empty array when user has no tasks', async () => {
      vi.mocked(firestoreService.getCollection).mockResolvedValue([]);

      const result = await tasksService.getTasks(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('getTask', () => {
    it('should get a specific task by ID', async () => {
      const mockTask = createTask({ id: mockTaskId, userId: mockUserId });

      vi.mocked(firestoreService.getDocument).mockResolvedValue(mockTask);

      const result = await tasksService.getTask(mockUserId, mockTaskId);

      expect(result).toEqual(mockTask);
      expect(firestoreService.getDocument).toHaveBeenCalledWith(
        `users/${mockUserId}/tasks`,
        mockTaskId
      );
    });

    it('should return null when task does not exist', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);

      const result = await tasksService.getTask(mockUserId, 'non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create a new task with all required fields', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 0,
      };

      const createdTask = createTask({
        id: 'new-task-id',
        userId: mockUserId,
        ...taskData,
      });

      vi.mocked(firestoreService.createDocument).mockResolvedValue(createdTask);

      const result = await tasksService.createTask(mockUserId, taskData);

      expect(result).toEqual(createdTask);
      expect(firestoreService.createDocument).toHaveBeenCalledWith(
        `users/${mockUserId}/tasks`,
        expect.objectContaining({
          title: taskData.title,
          description: taskData.description,
          status: 0,
          userId: mockUserId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should use default status 0 when status is not provided', async () => {
      const taskData = {
        title: 'New Task',
        status: 0,
      };

      const createdTask = createTask({
        id: 'new-task-id',
        userId: mockUserId,
        ...taskData,
      });

      vi.mocked(firestoreService.createDocument).mockResolvedValue(createdTask);

      await tasksService.createTask(mockUserId, taskData);

      expect(firestoreService.createDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          status: 0,
        })
      );
    });

    it('should include createdAt and updatedAt timestamps', async () => {
      const taskData = {
        title: 'New Task',
        status: 0,
      };

      const createdTask = createTask({
        id: 'new-task-id',
        userId: mockUserId,
        ...taskData,
      });

      vi.mocked(firestoreService.createDocument).mockResolvedValue(createdTask);

      await tasksService.createTask(mockUserId, taskData);

      const callArgs = vi.mocked(firestoreService.createDocument).mock.calls[0][1] as any;
      expect(callArgs.createdAt).toBeInstanceOf(Date);
      expect(callArgs.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updates = {
        title: 'Updated Title',
        status: 1,
      };

      const updatedTask = createTask({
        id: mockTaskId,
        userId: mockUserId,
        ...updates,
      });

      vi.mocked(firestoreService.updateDocument).mockResolvedValue(updatedTask);

      const result = await tasksService.updateTask(mockUserId, mockTaskId, updates);

      expect(result).toEqual(updatedTask);
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        `users/${mockUserId}/tasks`,
        mockTaskId,
        expect.objectContaining({
          ...updates,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should update only provided fields', async () => {
      const updates = {
        title: 'New Title',
      };

      const updatedTask = createTask({
        id: mockTaskId,
        userId: mockUserId,
        title: updates.title,
      });

      vi.mocked(firestoreService.updateDocument).mockResolvedValue(updatedTask);

      await tasksService.updateTask(mockUserId, mockTaskId, updates);

      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          title: updates.title,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should include updatedAt timestamp', async () => {
      const updates = { title: 'Updated' };
      const updatedTask = createTask({ id: mockTaskId, userId: mockUserId, ...updates });

      vi.mocked(firestoreService.updateDocument).mockResolvedValue(updatedTask);

      await tasksService.updateTask(mockUserId, mockTaskId, updates);

      const callArgs = vi.mocked(firestoreService.updateDocument).mock.calls[0][2] as any;
      expect(callArgs.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      vi.mocked(firestoreService.deleteDocument).mockResolvedValue(undefined);

      await tasksService.deleteTask(mockUserId, mockTaskId);

      expect(firestoreService.deleteDocument).toHaveBeenCalledWith(
        `users/${mockUserId}/tasks`,
        mockTaskId
      );
    });
  });

  describe('deleteAllTasks', () => {
    it('should delete all tasks for a user', async () => {
      vi.mocked(firestoreService.deleteCollection).mockResolvedValue(undefined);

      await tasksService.deleteAllTasks(mockUserId);

      expect(firestoreService.deleteCollection).toHaveBeenCalledWith(
        `users/${mockUserId}/tasks`
      );
    });
  });
});
