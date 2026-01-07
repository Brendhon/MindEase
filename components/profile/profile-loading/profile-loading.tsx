"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * ProfileLoading Component - MindEase
 * Loading state for profile page
 */
export interface ProfileLoadingProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileLoading({ "data-testid": testId }: ProfileLoadingProps) {
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
    <div className={containerClasses} data-testid={testId || "profile-loading-container"}>
      <div className={mainClasses}>
        <p className={loadingClasses} data-testid={testId ? `${testId}-text` : "profile-loading"}>
          {textDetail.getText("profile_loading")}
        </p>
      </div>
    </div>
  );
}

ProfileLoading.displayName = "ProfileLoading";

/**
 * ProfileLoading Styles - MindEase
 * Centralized styles for profile loading component
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
  loading: "text-text-secondary text-center",
} as const;

