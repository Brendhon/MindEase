"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * ProfileLoading Component - MindEase
 * Loading state for profile page
 */
export interface ProfileLoadingProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileLoading({ "data-testid": testId }: ProfileLoadingProps) {
  const { fontSizeClasses, animationClasses, spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

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
          {getText("profile_loading")}
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

