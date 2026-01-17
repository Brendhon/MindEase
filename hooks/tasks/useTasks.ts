import { useTasksContext } from "@/contexts/tasks";
import { useAuth } from "@/hooks/auth";
import { useFeedback } from "@/hooks/feedback";
import { Subtask, Task } from "@/models/Task";
import { tasksService } from "@/services/tasks";
import { useCallback } from "react";

/**
 * useTasks Hook - MindEase
 * Centralized hook for managing tasks with Firestore synchronization
 * 
 * This hook encapsulates all business logic following Next.js best practices:
 * - CRUD operations with Firestore
 * - State synchronization (local + remote)
 * - Loading and error handling
 * - User feedback (toasts)
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tasks, createTask, updateTask } = useTasks();
 *   
 *   const handleCreate = async () => {
 *     await createTask({ title: "New Task" });
 *   };
 *   
 *   return <div>{tasks.length} tasks</div>;
 * }
 * ```
 */
export function useTasks() {
  const { tasks, loading, error, _setTasks, _setLoading, _setError } = useTasksContext();
  const { user } = useAuth();
  const { success, error: showError } = useFeedback();

  /**
   * Initialize tasks from server data
   */
  const initializeTasks = useCallback((newTasks: Task[], newError: string | null) => {
    _setTasks(newTasks);
    _setError(newError);
  }, [_setTasks, _setError]);

  /**
   * Get a task by ID from local state
   */
  const getTask = useCallback((taskId: string): Task | undefined => {
    return tasks.find((t) => t.id === taskId);
  }, [tasks]);

  /**
   * Create a new task
   * Automatically syncs with Firestore and updates local state
   */
  const createTask = useCallback(
    async (taskData: {
      title: string;
      description?: string;
      subtasks?: Subtask[];
    }) => {
      if (!user?.uid) return;

      _setLoading(true);
      _setError(null);

      try {
        const newTask = await tasksService.createTask(user.uid, {
          title: taskData.title,
          description: taskData.description,
          subtasks: taskData.subtasks,
          status: 0,
        });

        _setTasks((prev) => [...prev, newTask]);
        success("toast_success_task_created");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create task";
        _setError(errorMessage);
        showError("toast_error_task_create_failed");
      } finally {
        _setLoading(false);
      }
    },
    [user?.uid, _setTasks, _setLoading, _setError, success, showError]
  );

  /**
   * Update an existing task
   * Automatically syncs with Firestore and updates local state
   */
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (!user?.uid) return;

      _setLoading(true);
      _setError(null);

      try {
        const updatedTask = await tasksService.updateTask(user.uid, taskId, updates);
        _setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

        const isComplete = updatedTask.status === 2;
        isComplete && success('toast_success_task_completed');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update task";
        _setError(errorMessage);
        showError("toast_error_task_update_failed");
      } finally {
        _setLoading(false);
      }
    },
    [user?.uid, _setTasks, _setLoading, _setError, success, showError]
  );

  /**
   * Delete a task
   * Automatically syncs with Firestore and updates local state
   */
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) return;

      _setLoading(true);
      _setError(null);

      try {
        await tasksService.deleteTask(user.uid, taskId);
        _setTasks((prev) => prev.filter((t) => t.id !== taskId));
        success("toast_success_task_deleted");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
        _setError(errorMessage);
        showError("toast_error_task_delete_failed");
      } finally {
        _setLoading(false);
      }
    },
    [user?.uid, _setTasks, _setLoading, _setError, success, showError]
  );

  /**
   * Refresh a task from Firestore
   * Useful when you need to ensure you have the latest data
   */
  const refreshTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) return;

      try {
        const task = await tasksService.getTask(user.uid, taskId);
        if (task) {
          _setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
        }
      } catch (error) {
        console.error("Error refreshing task:", error);
      }
    },
    [user?.uid, _setTasks]
  );

  /**
   * Update task status
   * Convenience method for status updates
   */
  const updateTaskStatus = useCallback(
    async (taskId: string, status: number) => {
      await updateTask(taskId, { status });
    },
    [updateTask]
  );

  /**
   * Check if has tasks in progress except the given task id
   * @param taskId - Task id to exclude
   * @returns true if has tasks in progress, false otherwise
   */
  const hasTasksInProgress = useCallback((taskId: string) => {
    return tasks.some((t) => t.status === 1 && t.id !== taskId);
  }, [tasks]);

  /**
   * Toggle subtask completion
   * Automatically syncs with Firestore and updates local state
   */
  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || !task.subtasks) return;

      const updatedSubtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );

      await updateTask(taskId, { subtasks: updatedSubtasks });
    },
    [tasks, updateTask]
  );

  return {
    // State
    tasks,
    loading,
    error,

    // Operations
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleSubtask,
    refreshTask,

    // Utilities
    getTask,
    initializeTasks,
    hasTasksInProgress,
  };
}
