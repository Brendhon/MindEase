"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * DashboardHeader Component - MindEase
 * Header section for dashboard page with title and description
 */
export interface DashboardHeaderProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function DashboardHeader({ "data-testid": testId }: DashboardHeaderProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  // Generate title classes with fontSize preference
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses["2xl"]),
    [fontSizeClasses["2xl"]]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <header className={styles.header} data-testid={testId || "dashboard-header"}>
      <h1 className={titleClasses} data-testid={testId ? `${testId}-title` : "dashboard-title"}>
        {textDetail.getText("dashboard_title")}
      </h1>
      <p className={descriptionClasses} data-testid={testId ? `${testId}-description` : "dashboard-description"}>
        {textDetail.getText("dashboard_description")}
      </p>
    </header>
  );
}

DashboardHeader.displayName = "DashboardHeader";

/**
 * DashboardHeader Styles - MindEase
 * Centralized styles for dashboard header component
 */

export const styles = {
  header: "flex flex-col",
  title: "font-semibold text-text-primary leading-tight",
  description: "text-text-secondary leading-relaxed mt-2",
} as const;
