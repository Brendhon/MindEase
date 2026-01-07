/**
 * Profile Page - MindEase
 * User profile and accessibility settings configuration
 * 
 * Features:
 * - Simple, low cognitive load interface
 * - Accessible design (WCAG compliant)
 * - Keyboard navigation support
 * - Clear visual hierarchy
 * - Uses own accessibility settings (self-referential)
 */
"use client";

import { ContentSettings } from "@/components/profile/content-settings";
import { InteractionSettings } from "@/components/profile/interaction-settings";
import { ProfileError } from "@/components/profile/profile-error";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileLoading } from "@/components/profile/profile-loading";
import { ProfileResetButton } from "@/components/profile/profile-reset-button";
import { VisualSettings } from "@/components/profile/visual-settings";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

export default function ProfilePage() {
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
    return <ProfileLoading data-testid="profile-page-loading" />;
  }

  return (
    <div className={cn(styles.container, animationClasses)} data-testid="profile-page-container">
      <main className={mainClasses} role="main">
        <ProfileHeader data-testid="profile-page-header" />

        {error && (
          <ProfileError
            message={textDetail.getText("profile_error")}
            data-testid="profile-page-error"
          />
        )}

        <div className={cn(styles.content, spacingClasses.gap)}>
          <VisualSettings data-testid="profile-page-visual-settings" />
          <InteractionSettings data-testid="profile-page-interaction-settings" />
          <ContentSettings data-testid="profile-page-content-settings" />
        </div>

        <ProfileResetButton data-testid="profile-page-reset-button" />
      </main>
    </div>
  );
}

/**
 * Profile Page Styles - MindEase
 * Centralized styles for profile page
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
  header: "flex flex-col",
  title: "font-semibold text-text-primary leading-tight",
  description: "text-text-secondary leading-relaxed mt-2",
  content: "flex flex-col w-full",
  footer: "flex justify-end mt-6",
  resetButton: "",
  loading: "text-text-secondary text-center",
  error: "bg-action-danger/10 text-action-danger border border-action-danger rounded-lg p-4",
} as const;
