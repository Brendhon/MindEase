"use client";

import { Card } from "@/components/ui";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileInfoRow } from "./profile-info-row";
import { User } from "next-auth";
import { AuthUser } from "@/contexts/auth-context";
import { cn } from "@/utils/ui";

/**
 * ProfileInfoCard Component - MindEase
 * Displays user information in a card format
 */
export interface ProfileInfoCardProps {
  /** User data */
  user: User | AuthUser;
  
  /** Label CSS classes */
  labelClassName?: string;
  
  /** Value CSS classes */
  valueClassName?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileInfoCard({ 
  user,
  labelClassName,
  valueClassName,
  className,
  "data-testid": testId 
}: ProfileInfoCardProps) {
  return (
    <Card className={cn(styles.infoCard, className)} data-testid={testId}>
      {user.image && (
        <ProfileAvatar
          image={user.image}
          name={user.name || undefined}
          data-testid={testId ? `${testId}-avatar` : "profile-avatar"}
        />
      )}

      {user.name && (
        <ProfileInfoRow
          labelKey="profile_info_name"
          value={user.name}
          labelClassName={labelClassName}
          valueClassName={valueClassName}
          data-testid={testId ? `${testId}-name-row` : "profile-name-row"}
        />
      )}
      
      <ProfileInfoRow
        labelKey="profile_info_email"
        value={user.email || ""}
        labelClassName={labelClassName}
        valueClassName={valueClassName}
        data-testid={testId ? `${testId}-email-row` : "profile-email-row"}
      />
    </Card>
  );
}

ProfileInfoCard.displayName = "ProfileInfoCard";

const styles = {
  infoCard: "gap-4",
} as const;
