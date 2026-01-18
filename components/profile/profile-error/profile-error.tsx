'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';

/**
 * ProfileError Component - MindEase
 * Error message display for profile page
 */
export interface ProfileErrorProps extends BaseComponentProps {
  /** Error message to display */
  message: string;
}

export function ProfileError({
  message,
  'data-testid': testId,
}: ProfileErrorProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  // Generate error classes with fontSize preference
  const errorClasses = useMemo(
    () => cn(styles.error, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <div
      className={errorClasses}
      role="alert"
      data-testid={testId || 'profile-error'}
    >
      {message}
    </div>
  );
}

ProfileError.displayName = 'ProfileError';

/**
 * ProfileError Styles - MindEase
 * Centralized styles for profile error component
 */

export const styles = {
  error:
    'bg-action-danger/10 text-action-danger border border-action-danger rounded-lg p-4',
} as const;
