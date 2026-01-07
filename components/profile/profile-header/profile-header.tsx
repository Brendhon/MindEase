"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * ProfileHeader Component - MindEase
 * Header section for profile page with title and description
 */
export interface ProfileHeaderProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileHeader({ "data-testid": testId }: ProfileHeaderProps) {
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
    <header className={styles.header} data-testid={testId || "profile-header"}>
      <h1 className={titleClasses} data-testid={testId ? `${testId}-title` : "profile-title"}>
        {textDetail.getText("profile_title")}
      </h1>
      <p className={descriptionClasses} data-testid={testId ? `${testId}-description` : "profile-description"}>
        {textDetail.getText("profile_description")}
      </p>
    </header>
  );
}

ProfileHeader.displayName = "ProfileHeader";

/**
 * ProfileHeader Styles - MindEase
 * Centralized styles for profile header component
 */

export const styles = {
  header: "flex flex-col",
  title: "font-semibold text-text-primary leading-tight",
  description: "text-text-secondary leading-relaxed mt-2",
} as const;

