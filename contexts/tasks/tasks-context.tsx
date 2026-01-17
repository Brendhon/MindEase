import { Task } from "@/models/task";
import { createContext, useContext } from "react";

/**
 * Tasks Context - MindEase
 * Global tasks state management
 * 
 * This context provides ONLY basic state:
 * - Tasks list
 * - Loading and error states
 * - Internal setters for useTasks hook
 * 
 * All business logic (CRUD operations, Firestore sync, feedback, utilities)
 * is handled by the useTasks hook. Components should use useTasks(), not useTasksContext().
 */

export interface TasksContextValue {
  /** List of all tasks */
  tasks: Task[];
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;

  // Internal setters - only used by useTasks hook
  _setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  _setLoading: (loading: boolean) => void;
  _setError: (error: string | null) => void;
}

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * Hook to access tasks context
 * 
 * ⚠️ **Note**: This hook is for internal use by useTasks hook only.
 * Components should use useTasks() instead, which provides all business logic.
 * 
 * @throws Error if used outside TasksProvider
 * 
 * @internal
 */
export function useTasksContext(): TasksContextValue {
  const context = useContext(TasksContext);
  
  if (context === undefined) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  
  return context;
}
