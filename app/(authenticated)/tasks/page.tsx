/**
 * Tasks Page - MindEase
 * Task organizer with simplified kanban board and focus timer
 * 
 * Features:
 * - Simplified kanban board (To Do, Done)
 * - Task creation and management
 * - Focus timer (Pomodoro)
 * - Simple, low cognitive load interface
 * - Accessible design (WCAG compliant)
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useTasks } from "@/hooks/useTasks";
import { useFeedback } from "@/hooks/useFeedback";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { tasksService } from "@/services/tasks/tasks";
import { TasksHeader } from "@/components/tasks/tasks-header";
import { TasksToolbar } from "@/components/tasks/tasks-toolbar";
import { TasksKanban } from "@/components/tasks/tasks-kanban";
import { TasksLoading } from "@/components/tasks/tasks-loading";
import { TasksError } from "@/components/tasks/tasks-error";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Task } from "@/models/Task";
import { cn } from "@/utils/ui";

export default function TasksPage() {
  const { user } = useAuth();
  const { spacingClasses, animationClasses, textDetail } = useCognitiveSettings();
  const { success, error: showError } = useFeedback();
  const {
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
  } = useTasks();
  const { timerState, startTimer, switchTask } = useFocusTimer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Load tasks from Firestore on mount
  useEffect(() => {
    if (!user?.uid) return;

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const userTasks = await tasksService.getTasks(user.uid);
        setTasks(userTasks);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user?.uid, setTasks, setLoading, setError]);

  // Generate main container classes with spacing preference
  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSubmitTask = async (taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user?.uid) return;

    try {
      if (editingTask) {
        // Update existing task
        await tasksService.updateTask(user.uid, editingTask.id, taskData);
        console.log("Task updated:", editingTask.id);
        updateTask(editingTask.id, taskData);
        success("toast_success_task_created");
      } else {
        // Create new task
        const newTask = await tasksService.createTask(user.uid, taskData);
        console.log("New task created:", newTask);
        addTask(newTask);
        success("toast_success_task_created");
      }
      setIsDialogOpen(false);
      setEditingTask(undefined);
    } catch (err) {
      console.error("Error saving task:", err);
      showError("toast_error_save_failed");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user?.uid) return;

    try {
      await tasksService.deleteTask(user.uid, taskId);
      deleteTask(taskId);
      success("toast_success_operation_completed");
    } catch (err) {
      console.error("Error deleting task:", err);
      showError("toast_error_processing");
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!user?.uid) return;

    const task = getTask(taskId);
    if (!task) return;

    try {
      // Cycle through status: 0 -> 1 -> 2 -> 0
      const newStatus = task.status === 2 ? 0 : task.status + 1;
      await tasksService.updateTask(user.uid, taskId, {
        status: newStatus,
      });
      toggleTask(taskId);
    } catch (err) {
      console.error("Error toggling task:", err);
      showError("toast_error_processing");
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    if (!user?.uid) return;

    const task = getTask(taskId);
    if (!task || !task.subtasks) return;

    try {
      const updatedSubtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );

      await tasksService.updateTask(user.uid, taskId, {
        subtasks: updatedSubtasks,
      });

      updateTask(taskId, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error("Error toggling subtask:", err);
      showError("toast_error_processing");
    }
  };

  const handleTaskStatusChange = async (taskId: string) => {
    if (!user?.uid) return;

    const task = getTask(taskId);
    if (!task || task.status === 1) return; // Already in progress

    try {
      await tasksService.updateTask(user.uid, taskId, { status: 1 }); // 1 = In Progress
      updateTask(taskId, { status: 1 });
    } catch (err) {
      console.error("Error updating task status:", err);
      showError("toast_error_processing");
    }
  };

  if (loading) {
    return <TasksLoading data-testid="tasks-page-loading" />;
  }

  return (
    <div className={cn(styles.container, animationClasses)} data-testid="tasks-page-container">
      <main className={mainClasses} role="main">
        <TasksHeader data-testid="tasks-page-header" />

        {error && (
          <TasksError
            message={textDetail.getText("tasks_error")}
            data-testid="tasks-page-error"
          />
        )}

        <TasksToolbar
          onAddTask={handleAddTask}
          data-testid="tasks-page-toolbar"
        />

        <TasksKanban
          tasks={tasks}
          onToggle={handleToggleTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleSubtask={handleToggleSubtask}
          onStartFocus={handleTaskStatusChange}
          data-testid="tasks-page-kanban"
        />
      </main>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleSubmitTask}
        initialTask={editingTask}
      />
    </div>
  );
}

/**
 * Tasks Page Styles - MindEase
 * Centralized styles for tasks page
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-7xl mx-auto",
} as const;
