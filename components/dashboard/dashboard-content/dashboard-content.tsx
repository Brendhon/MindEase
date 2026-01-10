"use client";

import { DashboardCognitiveAlerts } from "@/components/dashboard/dashboard-cognitive-alerts";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardStatsCards } from "@/components/dashboard/dashboard-stats-cards";
import { PageHeader } from "@/components/layout/page-header";
import { ContentSettings } from "@/components/profile/content-settings";
import { InteractionSettings } from "@/components/profile/interaction-settings";
import { ProfileResetButton } from "@/components/profile/profile-reset-button";
import { VisualSettings } from "@/components/profile/visual-settings";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Task } from "@/models/Task";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * DashboardContent Component - MindEase
 * Client-side interactive content for dashboard
 * 
 * This component handles all client-side interactivity including:
 * - Cognitive settings management
 * - Real-time accessibility adjustments
 */
export interface DashboardContentProps {
  /** Tasks data fetched from server */
  tasks: Task[];

  /** Error message if any */
  error?: string | null;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function DashboardContent({
  tasks,
  error,
  "data-testid": testId
}: DashboardContentProps) {
  const {
    isLoading: settingsLoading,
    error: settingsError,
    spacingClasses,
    animationClasses,
    textDetail,
  } = useCognitiveSettings();

  // Generate main container classes with spacing preference
  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const isLoading = settingsLoading;
  const hasError = error || settingsError;

  if (isLoading) {
    return <DashboardLoading data-testid="dashboard-page-loading" />;
  }

  return (
    <div className={cn(styles.container, animationClasses)} data-testid={testId || "dashboard-page-container"}>
      <main className={mainClasses} role="main">
        <PageHeader
          titleKey="dashboard_title"
          descriptionKey="dashboard_description"
          data-testid="dashboard-page-header"
        />

        {hasError && (
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

DashboardContent.displayName = "DashboardContent";

/**
 * DashboardContent Styles - MindEase
 * Centralized styles for dashboard content component
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
  content: "flex flex-col w-full",
} as const;
