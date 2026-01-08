/**
 * Task Model - MindEase
 * Task entity with cognitive accessibility features
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: number; // 0 = To Do, 1 = In Progress, 2 = Done
  createdAt: Date;
  updatedAt: Date;
}

