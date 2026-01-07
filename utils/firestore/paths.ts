/**
 * Firestore Paths - MindEase
 * Utility functions for Firestore collection and document paths
 */

/**
 * Get tasks collection path for a user
 * @param userId - User ID
 * @returns Collection path (e.g., "users/{userId}/tasks")
 */
export const getTasksCollectionPath = (userId: string): string => {
  if (!userId || userId.trim() === "") {
    throw new Error("User ID is required");
  }
  return `users/${userId}/tasks`;
};

/**
 * Get a specific task document path
 * @param userId - User ID
 * @param taskId - Task ID (optional)
 * @returns Document path (e.g., "users/{userId}/tasks/{taskId}")
 */
export const getTaskDocumentPath = (userId: string, taskId: string): string => {
  if (!userId || userId.trim() === "") {
    throw new Error("User ID is required");
  }
  if (!taskId || taskId.trim() === "") {
    throw new Error("Task ID is required");
  }
  return `users/${userId}/tasks/${taskId}`;
};

/**
 * Get tasks collection path (legacy function for backward compatibility)
 * @deprecated Use getTasksCollectionPath instead
 */
export const getTasksPath = (taskId?: string): string => {
  if (taskId) {
    return `tasks/${taskId}`;
  }
  return "tasks";
};

/**
 * Get user preferences document path
 * @param userId - User ID
 * @returns Document path (e.g., "user-preferences/{userId}")
 */
export const getUserPreferencesDocumentPath = (userId: string): string => {
  if (!userId || userId.trim() === "") {
    throw new Error("User ID is required");
  }
  return `user-preferences/${userId}`;
};