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
 */
"use client";

import { ContentSettings } from "@/components/profile/content-settings";
import { InteractionSettings } from "@/components/profile/interaction-settings";
import { ProfileResetButton } from "@/components/profile/profile-reset-button";
import { VisualSettings } from "@/components/profile/visual-settings";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

export default function DashboardPage() {
  const {
    isLoading,
    error,
    spacingClasses,
    animationClasses,
    textDetail,
  } = useCognitiveSettings();

  // Generate main container classes with spacing preference
  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

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

