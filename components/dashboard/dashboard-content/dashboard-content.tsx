"use client";

import { DashboardCognitiveAlerts, DashboardError, DashboardStatsCards, InteractionSettings, VisualSettings } from "@/components/dashboard";
import { PageContent, PageHeader } from "@/components/layout";
import { ContentSettings, ProfileResetButton } from "@/components/profile";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useTextDetail } from "@/hooks/accessibility";
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
    error: settingsError,
  } = useCognitiveSettings();
  
  // Use accessibility classes hook for optimized class generation
  // Only re-renders when spacing changes
  const { spacingClasses } = useAccessibilityClasses();
  
  // Use text detail hook for optimized text helpers
  // Only re-renders when textDetail setting changes
  const textDetail = useTextDetail();

  const hasError = error || settingsError;

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
