/**
 * Tasks Page - MindEase
 * Task organizer with simplified lists and focus timer
 */
export default function TasksPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary font-sans" data-testid="tasks-page-container">
      <main className="flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-3xl font-semibold text-text-primary" data-testid="tasks-title">
          Hello from Tasks
        </h1>
        <p className="text-lg text-text-secondary" data-testid="tasks-description">
          Organizador de tarefas
        </p>
      </main>
    </div>
  );
}

