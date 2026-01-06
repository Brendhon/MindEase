/**
 * Task Model - MindEase
 * Task entity with cognitive accessibility features
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

