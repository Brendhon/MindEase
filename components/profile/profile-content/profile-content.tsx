"use client";

import { ProfileInfo } from "@/components/profile/profile-info";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { User } from "next-auth";

/**
 * ProfileContent Component - MindEase
 * Client-side interactive content for profile page
 * 
 * This component handles all client-side interactivity including:
 * - Cognitive settings management
 * - Real-time accessibility adjustments
 */
export interface ProfileContentProps {
  /** User data from server */
  user: User;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileContent({ 
  user,
  "data-testid": testId 
}: ProfileContentProps) {
  const { animationClasses } = useCognitiveSettings();

  return (
    <div className={cn(styles.container, animationClasses)} data-testid={testId || "profile-page-container"}>
      <main className={styles.main} role="main">
        <ProfileInfo 
          user={user}
          data-testid="profile-page-info" 
        />
      </main>
    </div>
  );
}

ProfileContent.displayName = "ProfileContent";

/**
 * ProfileContent Styles - MindEase
 * Centralized styles for profile content component
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full",
} as const;
