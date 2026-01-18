'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { BaseComponentProps } from '@/models/base';

/**
 * DashboardError Component - MindEase
 * Error message display for dashboard page
 */
export interface DashboardErrorProps extends BaseComponentProps {
  /** Error message to display */
  message: string;
}

export function DashboardError({
  message,
  'data-testid': testId,
}: DashboardErrorProps) {
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
      data-testid={testId || 'dashboard-error'}
    >
      {message}
    </div>
  );
}

DashboardError.displayName = 'DashboardError';

/**
 * DashboardError Styles - MindEase
 * Centralized styles for dashboard error component
 */

export const styles = {
  error:
    'bg-action-danger/10 text-action-danger border border-action-danger rounded-lg p-4',
} as const;
