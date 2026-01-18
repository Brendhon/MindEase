/**
 * Dashboard Page - MindEase
 * Cognitive panel with interface complexity adjustments
 *
 * Features:
 * - Control and apply cognitive experience settings
 * - Real-time accessibility adjustments (complexity, focus mode, text detail)
 * - Visual settings (font size, contrast, spacing, animations)
 * - Automatic persistence to Firestore
 * - Cognitive alerts configuration
 * - Task statistics overview
 *
 * This is a Server Component that fetches data on the server side
 * following Next.js best practices.
 */
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/next-auth';
import { tasksService } from '@/services/tasks';
import { Task } from '@/models/task';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  // Get session on server side
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch tasks on server side
  let tasks: Task[] = [];
  let error: string | null = null;

  try {
    tasks = await tasksService.getTasks(session.user.id);
  } catch (err) {
    console.error('Error loading tasks:', err);
    error = err instanceof Error ? err.message : 'Failed to load tasks';
  }

  return (
    <DashboardContent
      tasks={tasks}
      error={error}
      data-testid="dashboard-page-container"
    />
  );
}
