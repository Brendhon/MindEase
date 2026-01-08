import { useState, useCallback } from "react";
import { Task } from "@/models/Task";

/**
 * useTasks Hook - MindEase
 * Hook for managing tasks state and operations
 */
export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = useCallback((task: Omit<Task, "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      status: task.status ?? 0, // Default to 0 (To Do) if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []); 

  const getTask = useCallback((id: string) => {
    return tasks.find((task) => task.id === id);
  }, [tasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          // Cycle through status: 0 -> 1 -> 2 -> 0
          const newStatus = task.status === 2 ? 0 : task.status + 1;
          return {
            ...task,
            status: newStatus,
            updatedAt: new Date(),
          };
        }
        return task;
      })
    );
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    getTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTasks,
    setLoading,
    setError,
  };
}

