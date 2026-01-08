/**
 * Profile Page - MindEase
 * User profile page with identity and session information
 * 
 * Features:
 * - Display user information (email, name, image)
 * - Logout functionality
 * - Simple, focused interface
 * - Accessible design (WCAG compliant)
 */
"use client";

import { ProfileInfo } from "@/components/profile/profile-info";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

export default function ProfilePage() {
  const { animationClasses } = useCognitiveSettings();

  return (
    <div className={cn(styles.container, animationClasses)} data-testid="profile-page-container">
      <main className={styles.main} role="main">
        <ProfileInfo data-testid="profile-page-info" />
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
  main: "flex flex-col w-full",
} as const;
