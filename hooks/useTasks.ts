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

  const addTask = useCallback((task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      userId: "", // This should be set by the caller or service
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

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
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTasks,
    setLoading,
    setError,
  };
}

