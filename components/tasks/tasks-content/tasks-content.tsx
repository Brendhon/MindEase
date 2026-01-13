"use client";

import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { useFocusTimer } from "@/contexts/focus-timer-context";
import { useAuth } from "@/hooks/useAuth";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFeedback } from "@/hooks/useFeedback";
import { Subtask, Task } from "@/models/Task";
import { tasksService } from "@/services/tasks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BreakSuggestion } from "../break-suggestion";
import { TaskDeleteDialog } from "../task-delete-dialog";
import { TaskDialog } from "../task-dialog";
import { TaskList } from "../task-list";
import { TasksError } from "../tasks-error";
import { TasksLoading } from "../tasks-loading";
import { TasksToolbar } from "../tasks-toolbar";

/**
 * TasksContent Component - MindEase
 * Main content component for tasks page
 */
export interface TasksContentProps {
  /** Initial tasks loaded from server */
  initialTasks: Task[];
  
  /** Initial error (if any) */
  initialError?: string | null;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksContent({
  initialTasks,
  initialError,
  "data-testid": testId,
}: TasksContentProps) {
  const { user } = useAuth();
  const { timerState, stopTimer, resumeTimer } = useFocusTimer();
  const { settings } = useCognitiveSettings();
  const { success, error: showError, info } = useFeedback();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Sync tasks when initialTasks change
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Monitor timer pause - use a ref to track previous state
  const prevTimerStateRef = useRef(timerState);
  
  useEffect(() => {
    const prev = prevTimerStateRef.current;
    const current = timerState;
    
    // Detect when user pauses - show break suggestion
    if (
      prev.timerState === "running" &&
      current.timerState === "paused" &&
      current.activeTaskId !== null
    ) {
      setShowBreakSuggestion(true);
    }
    
    // Hide break suggestion when timer resumes or stops
    if (current.timerState === "running" || (current.timerState === "idle" && current.activeTaskId === null)) {
      setShowBreakSuggestion(false);
    }

    prevTimerStateRef.current = current;
  }, [timerState, settings.shortBreakDuration, info]);

  // Get active task name
  const activeTaskName = useMemo(() => {
    if (!timerState.activeTaskId) return undefined;
    const task = tasks.find((t) => t.id === timerState.activeTaskId);
    return task?.title;
  }, [timerState.activeTaskId, tasks]);

  // Create task
  const handleCreateTask = useCallback(async (taskData: {
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
  const handleUpdateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
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

  // Request delete (show confirmation)
  const handleRequestDelete = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  }, []);

  // Delete task (after confirmation)
  const handleDeleteTask = useCallback(async () => {
    if (!user?.uid || !taskToDelete) return;

    setLoading(true);
    setError(null);

    try {
      await tasksService.deleteTask(user.uid, taskToDelete);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      
      // Stop timer if deleted task was active
      if (timerState.activeTaskId === taskToDelete) {
        stopTimer();
      }

      success("toast_success_task_deleted");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      showError("toast_error_task_delete_failed");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  }, [user?.uid, taskToDelete, timerState.activeTaskId, stopTimer, success, showError]);

  // Edit task
  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }, []);

  // Save task (create or update)
  const handleSaveTask = useCallback(async (taskData: {
    title: string;
    description?: string;
    subtasks?: Subtask[];
  }) => {
    if (editingTask) {
      await handleUpdateTask(editingTask.id, taskData);
    } else {
      await handleCreateTask(taskData);
    }
    setIsDialogOpen(false);
    setEditingTask(undefined);
  }, [editingTask, handleUpdateTask, handleCreateTask]);

  // Status change
  const handleStatusChange = useCallback(async (taskId: string, status: number) => {
    await handleUpdateTask(taskId, { status });
  }, [handleUpdateTask]);

  // Toggle subtask
  const handleToggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await handleUpdateTask(taskId, { subtasks: updatedSubtasks });
  }, [tasks, handleUpdateTask]);

  // New task button
  const handleNewTask = useCallback(() => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  }, []);

  // Dialog close
  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setEditingTask(undefined);
  }, []);

  const handleResumeFromBreak = useCallback(() => {
    resumeTimer();
    setShowBreakSuggestion(false);
  }, [resumeTimer]);

  if (loading && tasks.length === 0) {
    return (
      <PageContent data-testid={testId || "tasks-page"}>
        <PageHeader
          titleKey="tasks_title"
          descriptionKey="tasks_description"
        />
        <TasksLoading />
      </PageContent>
    );
  }

  return (
    <PageContent 
      data-testid={testId || "tasks-page"}
      mainClassName={styles.tasksMain}
    >
      <PageHeader
        titleKey="tasks_title"
        descriptionKey="tasks_description"
      />

      {error && <TasksError message={error} />}

      {/* Break suggestion (when paused) */}
      <BreakSuggestion
        isVisible={showBreakSuggestion && timerState.timerState === "paused"}
        breakDuration={settings.shortBreakDuration || 5}
        onResume={handleResumeFromBreak}
      />

      {/* Toolbar */}
      <TasksToolbar onNewTask={handleNewTask} />

      {/* Task list */}
      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleRequestDelete}
        onStatusChange={handleStatusChange}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* Task dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        task={editingTask}
        onSave={handleSaveTask}
      />

      {/* Delete confirmation dialog */}
      <TaskDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteTask}
      />
    </PageContent>
  );
}

TasksContent.displayName = "TasksContent";

const styles = {
  tasksMain: "max-w-7xl",
} as const;
