/**
 * Tasks Page - MindEase
 * Task organizer page with cognitive accessibility features
 * 
 * Features:
 * - View and manage tasks
 * - Focus timer integration
 * - Task checklist support
 * - Simple, predictable interface
 * 
 * This is a Server Component that fetches data on the server side
 * following Next.js best practices.
 */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/next-auth";
import { tasksService } from "@/services/tasks";
import { Task } from "@/models/Task";
import { TasksContent } from "@/components/tasks";

export default async function TasksPage() {
  // Get session on server side
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch tasks on server side
  let tasks: Task[] = [];
  let error: string | null = null;

  try {
    tasks = await tasksService.getTasks(session.user.id);
  } catch (err) {
    console.error("Error loading tasks:", err);
    error = err instanceof Error ? err.message : "Failed to load tasks";
  }

  return (
    <TasksContent 
      initialTasks={tasks} 
      initialError={error}
      data-testid="tasks-page-container"
    />
  );
}
