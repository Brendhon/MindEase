/**
 * Dashboard Page - MindEase
 * Cognitive panel with interface complexity adjustments
 */
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary font-sans" data-testid="dashboard-page-container">
      <main className="flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-3xl font-semibold text-text-primary" data-testid="dashboard-title">
          Hello from Dashboard
        </h1>
        <p className="text-lg text-text-secondary" data-testid="dashboard-description">
          Painel cognitivo
        </p>
      </main>
    </div>
  );
}

