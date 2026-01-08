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
 */
"use client";

import { useEffect, useMemo } from "react";
import { ContentSettings } from "@/components/profile/content-settings";
import { InteractionSettings } from "@/components/profile/interaction-settings";
import { ProfileResetButton } from "@/components/profile/profile-reset-button";
import { VisualSettings } from "@/components/profile/visual-settings";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardStatsCards } from "@/components/dashboard/dashboard-stats-cards";
import { DashboardCognitiveAlerts } from "@/components/dashboard/dashboard-cognitive-alerts";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { tasksService } from "@/services/tasks";
import { cn } from "@/utils/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    isLoading: settingsLoading,
    error: settingsError,
    spacingClasses,
    animationClasses,
    textDetail,
  } = useCognitiveSettings();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    setTasks,
    setLoading,
    setError,
  } = useTasks();

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

  const isLoading = settingsLoading || tasksLoading;
  const error = settingsError || tasksError;

  if (isLoading) {
    return <DashboardLoading data-testid="dashboard-page-loading" />;
  }

  return (
    <div className={cn(styles.container, animationClasses)} data-testid="dashboard-page-container">
      <main className={mainClasses} role="main">
        <DashboardHeader data-testid="dashboard-page-header" />

        {error && (
          <DashboardError
            message={textDetail.getText("dashboard_error")}
            data-testid="dashboard-page-error"
          />
        )}

        {/* Cognitive Alerts */}
        <DashboardCognitiveAlerts
          tasks={tasks}
          data-testid="dashboard-page-cognitive-alerts"
        />

        {/* Task Statistics Cards */}
        <DashboardStatsCards
          tasks={tasks}
          data-testid="dashboard-page-stats-cards"
        />

        {/* Cognitive Settings */}
        <div className={cn(styles.content, spacingClasses.gap)}>
          <VisualSettings data-testid="dashboard-page-visual-settings" />
          <InteractionSettings data-testid="dashboard-page-interaction-settings" />
          <ContentSettings data-testid="dashboard-page-content-settings" />
        </div>

        <ProfileResetButton data-testid="dashboard-page-reset-button" />
      </main>
    </div>
  );
}

/**
 * Dashboard Page Styles - MindEase
 * Centralized styles for dashboard page
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
  content: "flex flex-col w-full",
} as const;

