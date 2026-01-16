"use client";

import Image from "next/image";
import { cn } from "@/utils/ui";

/**
 * ProfileAvatar Component - MindEase
 * Displays user avatar image
 */
export interface ProfileAvatarProps {
  /** Image URL */
  image: string;
  
  /** User name for alt text */
  name?: string | null;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileAvatar({ 
  image, 
  name, 
  className,
  "data-testid": testId 
}: ProfileAvatarProps) {
  return (
    <div className={cn(styles.avatarContainer, className)} data-testid={testId}>
      <Image
        src={image}
        alt={name || "User avatar"}
        width={96}
        height={96}
        loading="eager"
        className={styles.avatar}
      />
    </div>
  );
}

ProfileAvatar.displayName = "ProfileAvatar";

const styles = {
  avatarContainer: "flex justify-center",
  avatar: "rounded-full",
} as const;
