"use client";

import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { Task, Subtask } from "@/models/Task";
import { tasksService } from "@/services/tasks";
import { useAuth } from "@/hooks/useAuth";
import { useFeedback } from "@/hooks/useFeedback";

/**
 * Tasks Context - MindEase
 * Global tasks state management
 * 
 * Manages all tasks state including:
 * - Tasks list
 * - Loading and error states
 * - CRUD operations (create, read, update, delete)
 * - Task refresh functionality
 */

export interface TasksContextValue {
  /** List of all tasks */
  tasks: Task[];
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;

  /** Initialize tasks from server data */
  initializeTasks: (tasks: Task[], error: string | null) => void;
  
  /** Create a new task */
  createTask: (taskData: {
    title: string;
    description?: string;
    subtasks?: Subtask[];
  }) => Promise<void>;
  
  /** Update an existing task */
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  
  /** Delete a task */
  deleteTask: (taskId: string) => Promise<void>;
  
  /** Refresh a task by fetching it from Firestore */
  refreshTask: (taskId: string) => Promise<void>;
  
  /** Get a task by ID */
  getTask: (taskId: string) => Task | undefined;
  
  /** Update task status */
  updateTaskStatus: (taskId: string, status: number) => Promise<void>;
  
  /** Toggle subtask completion */
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * Tasks Provider Props
 */
export interface TasksProviderProps {
  children: ReactNode;
  /** Initial tasks loaded from server */
  initialTasks?: Task[];
  /** Initial error (if any) */
  initialError?: string | null;
}

/**
 * Tasks Provider Component
 * Provides tasks context to children components
 */
export function TasksProvider({ 
  children,
  initialTasks = [],
  initialError = null,
}: TasksProviderProps) {
  const { user } = useAuth();
  const { success, error: showError } = useFeedback();
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Sync tasks when initialTasks change
  const initializeTasks = useCallback((newTasks: Task[], newError: string | null) => {
    setTasks(newTasks);
    setError(newError);
  }, []);

  // Sync error when initialError changes
  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  // Get a task by ID
  const getTask = useCallback((taskId: string): Task | undefined => {
    return tasks.find((t) => t.id === taskId);
  }, [tasks]);

  // Create task
  const createTask = useCallback(async (taskData: {
    title: string;
    description?: string;
    subtasks?: Subtask[];
  }) => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const newTask = await tasksService.createTask(user.uid, {
        title: taskData.title,
        description: taskData.description,
        subtasks: taskData.subtasks,
        status: 0,
      });

      setTasks((prev) => [...prev, newTask]);
      success("toast_success_task_created");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      showError("toast_error_task_create_failed");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, success, showError]);

  // Update task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const updatedTask = await tasksService.updateTask(user.uid, taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      const messageKey = updatedTask.status === 2 ? "toast_success_task_completed" : "toast_success_task_updated";
      success(messageKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
      showError("toast_error_task_update_failed");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, success, showError]);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      await tasksService.deleteTask(user.uid, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      success("toast_success_task_deleted");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      showError("toast_error_task_delete_failed");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, success, showError]);

  // Refresh task by fetching from Firestore
  const refreshTask = useCallback(async (taskId: string) => {
    if (!user?.uid) return;

    try {
      const task = await tasksService.getTask(user.uid, taskId);
      if (task) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
      }
    } catch (error) {
      console.error("Error refreshing task:", error);
    }
  }, [user?.uid]);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId: string, status: number) => {
    await updateTask(taskId, { status });
  }, [updateTask]);

  // Toggle subtask
  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await updateTask(taskId, { subtasks: updatedSubtasks });
  }, [tasks, updateTask]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        initializeTasks,
        createTask,
        updateTask,
        deleteTask,
        refreshTask,
        getTask,
        updateTaskStatus,
        toggleSubtask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

/**
 * Hook to access tasks context
 * @throws Error if used outside TasksProvider
 */
export function useTasksContext(): TasksContextValue {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  return context;
}
