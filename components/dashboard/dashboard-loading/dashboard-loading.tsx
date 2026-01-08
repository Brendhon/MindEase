"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * DashboardLoading Component - MindEase
 * Loading state for dashboard page
 */
export interface DashboardLoadingProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function DashboardLoading({ "data-testid": testId }: DashboardLoadingProps) {
  const { fontSizeClasses, animationClasses, spacingClasses, textDetail } = useCognitiveSettings();

  const containerClasses = useMemo(
    () => cn(styles.container, animationClasses),
    [animationClasses]
  );

  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const loadingClasses = useMemo(
    () => cn(styles.loading, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <div className={containerClasses} data-testid={testId || "dashboard-loading-container"}>
      <div className={mainClasses}>
        <p className={loadingClasses} data-testid={testId ? `${testId}-text` : "dashboard-loading"}>
          {textDetail.getText("dashboard_loading")}
        </p>
      </div>
    </div>
  );
}

DashboardLoading.displayName = "DashboardLoading";

/**
 * DashboardLoading Styles - MindEase
 * Centralized styles for dashboard loading component
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
  loading: "text-text-secondary text-center",
} as const;
