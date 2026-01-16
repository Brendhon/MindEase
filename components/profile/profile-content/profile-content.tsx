"use client";

import { PageContent } from "@/components/layout";
import { ProfileInfo } from "@/components/profile";
import { AuthUser } from "@/models/Auth";

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
  user: AuthUser | null;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileContent({ 
  user,
  "data-testid": testId 
}: ProfileContentProps) {
  return (
    <PageContent 
      data-testid={testId || "profile-page-container"}
    >
      <ProfileInfo 
        user={user}
        data-testid="profile-page-info" 
      />
    </PageContent>
  );
}

ProfileContent.displayName = "ProfileContent";
