'use client';

import Image from 'next/image';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { useAccessibilityClasses } from '@/hooks/accessibility';
import { useCognitiveSettings } from '@/hooks/cognitive-settings';
import { BaseComponentProps } from '@/models/base';
import { styles, getContrastClassesForProfile } from './profile-info-styles';

/**
 * ProfileAvatar Component - MindEase
 * Displays user avatar image or initials (like Teams)
 */
export interface ProfileAvatarProps extends BaseComponentProps {
  /** Image URL (optional) */
  image?: string | null;

  /** User name for alt text and initials fallback */
  name?: string | null;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Extract initials from name (first letter of first and last name)
 * Similar to Microsoft Teams avatar behavior
 */
function getInitials(name: string | null | undefined): string {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();

  // First letter of first name + first letter of last name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Fixed accessible color for avatar initials background
 * Uses primary action color for consistency and accessibility
 * Ensures good contrast with white text (text-text-inverse)
 */
const AVATAR_BG_COLOR = 'bg-action-primary';

export function ProfileAvatar({
  image,
  name,
  className,
  'data-testid': testId,
}: ProfileAvatarProps) {
  const initials = useMemo(() => getInitials(name), [name]);
  const { animationClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();

  // Generate accessible classes with memoization
  const containerClasses = useMemo(
    () => cn(styles.avatarContainer, className),
    [className]
  );

  const avatarClasses = useMemo(
    () =>
      cn(
        styles.avatar,
        animationClasses,
        getContrastClassesForProfile(settings.contrast, 'avatar')
      ),
    [animationClasses, settings.contrast]
  );

  const initialsContainerClasses = useMemo(
    () =>
      cn(
        styles.avatar,
        styles.initialsContainer,
        AVATAR_BG_COLOR,
        animationClasses,
        getContrastClassesForProfile(settings.contrast, 'avatar')
      ),
    [animationClasses, settings.contrast]
  );

  return (
    <div className={containerClasses} data-testid={testId}>
      {image ? (
        <Image
          src={image}
          alt={name ? `${name} avatar` : 'User avatar'}
          width={96}
          height={96}
          loading="eager"
          className={avatarClasses}
        />
      ) : (
        <div
          className={initialsContainerClasses}
          aria-label={name ? `${name} avatar` : 'User avatar'}
        >
          <span className={styles.initials}>{initials}</span>
        </div>
      )}
    </div>
  );
}

ProfileAvatar.displayName = 'ProfileAvatar';
