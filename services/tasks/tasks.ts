import { Task } from "@/models/Task";
import { firestoreService } from "../firestore";
import { getTasksCollectionPath, getTaskDocumentPath } from "@/utils/firestore/paths";

/**
 * Tasks Service - MindEase
 * Task management service
 */
export interface TasksService {
  getTasks: (userId: string) => Promise<Task[]>;
  getTask: (userId: string, taskId: string) => Promise<Task | null>;
  createTask: (userId: string, task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<Task>;
  updateTask: (userId: string, taskId: string, updates: Partial<Omit<Task, "id" | "userId">>) => Promise<Task>;
  deleteTask: (userId: string, taskId: string) => Promise<void>;
  deleteAllTasks: (userId: string) => Promise<void>;
}

export const tasksService: TasksService = {
  /**
   * Get all tasks for a user
   */
  getTasks: async (userId: string): Promise<Task[]> => {
    return firestoreService.getCollection<Task>(getTasksCollectionPath(userId));
  },

  /**
   * Get a specific task by ID
   */
  getTask: async (userId: string, taskId: string): Promise<Task | null> => {
    const collectionPath = getTasksCollectionPath(userId);
    return firestoreService.getDocument<Task>(collectionPath, taskId);
  },

  /**
   * Create a new task for a user
   */
  createTask: async (
    userId: string,
    task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Task> => {
    const taskData: Omit<Task, "id"> = {
      ...task,
      status: task.status ?? 0, // Default to 0 (To Do) if not provided
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return firestoreService.createDocument<Task>(getTasksCollectionPath(userId), taskData);
  },

  /**
   * Update an existing task
   */
  updateTask: async (
    userId: string,
    taskId: string,
    updates: Partial<Omit<Task, "id" | "userId">>
  ): Promise<Task> => {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };
    const collectionPath = getTasksCollectionPath(userId);
    return firestoreService.updateDocument<Task>(collectionPath, taskId, updatedData);
  },

  /**
   * Delete a task
   */
  deleteTask: async (userId: string, taskId: string): Promise<void> => {
    const collectionPath = getTasksCollectionPath(userId);
    return firestoreService.deleteDocument(collectionPath, taskId);
  },

  /**
   * Delete all tasks for a user
   */
  deleteAllTasks: async (userId: string): Promise<void> => {
    const collectionPath = getTasksCollectionPath(userId);
    return firestoreService.deleteCollection(collectionPath);
  },
};
