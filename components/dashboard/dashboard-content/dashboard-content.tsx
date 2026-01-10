"use client";

import { DashboardCognitiveAlerts } from "@/components/dashboard/dashboard-cognitive-alerts";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardStatsCards } from "@/components/dashboard/dashboard-stats-cards";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { ContentSettings } from "@/components/profile/content-settings";
import { InteractionSettings } from "@/components/profile/interaction-settings";
import { ProfileResetButton } from "@/components/profile/profile-reset-button";
import { VisualSettings } from "@/components/profile/visual-settings";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Task } from "@/models/Task";
import { cn } from "@/utils/ui";

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
    textDetail,
  } = useCognitiveSettings();

  const isLoading = settingsLoading;
  const hasError = error || settingsError;

  if (isLoading) {
    return <DashboardLoading data-testid="dashboard-page-loading" />;
  }

  return (
    <PageContent 
      data-testid={testId || "dashboard-page-container"}
    >
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
    </PageContent>
  );
}

DashboardContent.displayName = "DashboardContent";

/**
 * DashboardContent Styles - MindEase
 * Centralized styles for dashboard content component
 */

export const styles = {
  content: "flex flex-col w-full",
} as const;
