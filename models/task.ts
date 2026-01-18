/**
 * Task Model - MindEase
 * Task entity with cognitive accessibility features
 */

/**
 * Subtask interface for checklist items
 */
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

/**
 * Task interface with intelligent checklist support
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: number; // 0 = To Do, 1 = In Progress, 2 = Done
  subtasks?: Subtask[]; // Intelligent checklist
  createdAt: Date;
  updatedAt: Date;
}
