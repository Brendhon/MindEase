import { Task } from "@/models/Task";
import { firestoreService } from "../firestore";
import { getTasksCollectionPath } from "@/utils/firestore/paths";

/**
 * Tasks Service - MindEase
 * Task management service
 */
export interface TasksService {
  getTasks: (userId: string) => Promise<Task[]>;
  createTask: (userId: string, task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<Task>;
  updateTask: (userId: string, taskId: string, updates: Partial<Omit<Task, "id" | "userId">>) => Promise<Task>;
  deleteTask: (userId: string, taskId: string) => Promise<void>;
}

export const tasksService: TasksService = {
  /**
   * Get all tasks for a user
   */
  getTasks: async (userId: string): Promise<Task[]> => {
    return firestoreService.getCollection<Task>(getTasksCollectionPath(userId));
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
};
