"use client";

import { ReactNode, useState, useCallback, useEffect } from "react";
import { Task } from "@/models/Task";
import { TasksContext } from "@/contexts/tasks-context";

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
 * Tasks Provider Component - MindEase
 * Provides tasks context to children components
 * 
 * This provider manages ONLY basic state (tasks, loading, error).
 * All business logic is handled by the useTasks hook.
 */
export function TasksProvider({
  children,
  initialTasks = [],
  initialError = null,
}: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Sync error when initialError changes
  useEffect(() => setError(initialError), [initialError]);

  // Internal setters for useTasks hook to use
  const setTasksState = useCallback((newTasks: Task[] | ((prev: Task[]) => Task[])) => setTasks(newTasks), []);

  const setLoadingState = useCallback((isLoading: boolean) => setLoading(isLoading), []);

  const setErrorState = useCallback((msg: string | null) => setError(msg), []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        _setTasks: setTasksState,
        _setLoading: setLoadingState,
        _setError: setErrorState,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
