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

// Test constants
const MOCK_USER_ID = 'user-123';
const MOCK_TASK_ID = 'task-456';
const MOCK_COLLECTION_PATH = `users/${MOCK_USER_ID}/tasks`;

// Helper functions for common mock setups
const setupGetCollectionSuccess = <T>(data: T[]) => {
  vi.mocked(firestoreService.getCollection).mockResolvedValue(data);
};

const setupGetDocumentSuccess = <T>(data: T | null) => {
  vi.mocked(firestoreService.getDocument).mockResolvedValue(data);
};

const setupCreateDocumentSuccess = <T extends { id: string }>(data: T) => {
  (vi.mocked(firestoreService.createDocument) as any).mockResolvedValue(data);
};

const setupUpdateDocumentSuccess = <T>(data: T) => {
  vi.mocked(firestoreService.updateDocument).mockResolvedValue(data);
};

const setupDeleteDocumentSuccess = () => {
  vi.mocked(firestoreService.deleteDocument).mockResolvedValue(undefined);
};

const setupDeleteCollectionSuccess = () => {
  vi.mocked(firestoreService.deleteCollection).mockResolvedValue(undefined);
};

describe('tasksService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should get all tasks for a user', async () => {
      const mockTasks: Task[] = [
        createTask({ id: 'task-1', userId: MOCK_USER_ID, title: 'Task 1' }),
        createTask({ id: 'task-2', userId: MOCK_USER_ID, title: 'Task 2' }),
      ];

      setupGetCollectionSuccess(mockTasks);

      const result = await tasksService.getTasks(MOCK_USER_ID);

      expect(result).toEqual(mockTasks);
      expect(firestoreService.getCollection).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH
      );
    });

    it('should return empty array when user has no tasks', async () => {
      setupGetCollectionSuccess([]);

      const result = await tasksService.getTasks(MOCK_USER_ID);

      expect(result).toEqual([]);
      expect(firestoreService.getCollection).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH
      );
    });
  });

  describe('getTask', () => {
    it('should get a specific task by ID', async () => {
      const mockTask = createTask({ id: MOCK_TASK_ID, userId: MOCK_USER_ID });

      setupGetDocumentSuccess(mockTask);

      const result = await tasksService.getTask(MOCK_USER_ID, MOCK_TASK_ID);

      expect(result).toEqual(mockTask);
      expect(firestoreService.getDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_TASK_ID
      );
    });

    it('should return null when task does not exist', async () => {
      setupGetDocumentSuccess(null);

      const result = await tasksService.getTask(MOCK_USER_ID, 'non-existent');

      expect(result).toBeNull();
      expect(firestoreService.getDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        'non-existent'
      );
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
        userId: MOCK_USER_ID,
        ...taskData,
      });

      setupCreateDocumentSuccess(createdTask);

      const result = await tasksService.createTask(MOCK_USER_ID, taskData);

      expect(result).toEqual(createdTask);
      expect(firestoreService.createDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        expect.objectContaining({
          title: taskData.title,
          description: taskData.description,
          status: 0,
          userId: MOCK_USER_ID,
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
        userId: MOCK_USER_ID,
        ...taskData,
      });

      setupCreateDocumentSuccess(createdTask);

      await tasksService.createTask(MOCK_USER_ID, taskData);

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
        userId: MOCK_USER_ID,
        ...taskData,
      });

      setupCreateDocumentSuccess(createdTask);

      await tasksService.createTask(MOCK_USER_ID, taskData);

      const callArgs = vi.mocked(firestoreService.createDocument).mock
        .calls[0][1] as any;
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
        id: MOCK_TASK_ID,
        userId: MOCK_USER_ID,
        ...updates,
      });

      setupUpdateDocumentSuccess(updatedTask);

      const result = await tasksService.updateTask(
        MOCK_USER_ID,
        MOCK_TASK_ID,
        updates
      );

      expect(result).toEqual(updatedTask);
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_TASK_ID,
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
        id: MOCK_TASK_ID,
        userId: MOCK_USER_ID,
        title: updates.title,
      });

      setupUpdateDocumentSuccess(updatedTask);

      await tasksService.updateTask(MOCK_USER_ID, MOCK_TASK_ID, updates);

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
      const updatedTask = createTask({
        id: MOCK_TASK_ID,
        userId: MOCK_USER_ID,
        ...updates,
      });

      setupUpdateDocumentSuccess(updatedTask);

      await tasksService.updateTask(MOCK_USER_ID, MOCK_TASK_ID, updates);

      const callArgs = vi.mocked(firestoreService.updateDocument).mock
        .calls[0][2] as any;
      expect(callArgs.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      setupDeleteDocumentSuccess();

      await tasksService.deleteTask(MOCK_USER_ID, MOCK_TASK_ID);

      expect(firestoreService.deleteDocument).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH,
        MOCK_TASK_ID
      );
    });
  });

  describe('deleteAllTasks', () => {
    it('should delete all tasks for a user', async () => {
      setupDeleteCollectionSuccess();

      await tasksService.deleteAllTasks(MOCK_USER_ID);

      expect(firestoreService.deleteCollection).toHaveBeenCalledWith(
        MOCK_COLLECTION_PATH
      );
    });
  });
});
