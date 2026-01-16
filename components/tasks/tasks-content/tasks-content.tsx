"use client";

import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { useDialog } from "@/hooks/useDialog";
import { useFeedback } from "@/hooks/useFeedback";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/models/Task";
import { type TaskDialogFormData } from "@/schemas/task-dialog.schema";
import { useCallback, useEffect, useState } from "react";
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
  initialError: string | null;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Inner component that uses the tasks context
 */
export function TasksContent({
  initialTasks,
  initialError,
  "data-testid": testId,
}: TasksContentProps) {
  const { timerState, stopTimer } = useFocusTimer();
  const { openDialog } = useDialog();
  const { success } = useFeedback();
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleSubtask,
    initializeTasks,
  } = useTasks();

  useEffect(() => {
    initializeTasks(initialTasks, initialError);
  }, [initialTasks, initialError, initializeTasks]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Delete task (after confirmation)
  const handleDeleteTask = useCallback(async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete);
      
      // Stop timer if deleted task was active
      if (timerState.activeTaskId === taskToDelete) {
        stopTimer();
      }
    } finally {
      setTaskToDelete(null);
    }
  }, [taskToDelete, timerState.activeTaskId, stopTimer, deleteTask]);

  // Request delete (show confirmation)
  const handleRequestDelete = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
    openDialog({
      titleKey: "tasks_delete_confirm_title",
      descriptionKey: "tasks_delete_confirm_message",
      cancelLabelKey: "button_cancel",
      confirmLabelKey: "tasks_delete_confirm_button",
      confirmVariant: "danger",
      onCancel: () => {
        setTaskToDelete(null);
      },
      onConfirm: async () => {
        await handleDeleteTask();
      },
      "data-testid": "task-delete-dialog",
    });
  }, [openDialog, handleDeleteTask]);

  // Edit task
  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }, []);

  // Save task (create or update)
  const handleSaveTask = useCallback(async (taskData: TaskDialogFormData) => {
    
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask(taskData);
    }
    setIsDialogOpen(false);
    setEditingTask(undefined);
  }, [editingTask, updateTask, createTask, success]);

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

  // Removed handleResumeFromBreak - no pause functionality

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

      {/* Break suggestion removed - no pause functionality */}

      {/* Toolbar */}
      <TasksToolbar onNewTask={handleNewTask} />

      {/* Task list */}
      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleRequestDelete}
        onStatusChange={updateTaskStatus}
        onToggleSubtask={toggleSubtask}
      />

      {/* Task dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </PageContent>
  );
}

TasksContent.displayName = "TasksContent";

const styles = {
  tasksMain: "max-w-7xl",
} as const;
