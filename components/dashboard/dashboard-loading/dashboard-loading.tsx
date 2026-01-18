'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { useTextDetail } from '@/hooks/accessibility';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { BaseComponentProps } from '@/models/base';

/**
 * DashboardLoading Component - MindEase
 * Loading state for dashboard page
 */
export interface DashboardLoadingProps extends BaseComponentProps {}

export function DashboardLoading({
  'data-testid': testId,
}: DashboardLoadingProps) {
  const { fontSizeClasses, animationClasses, spacingClasses } =
    useAccessibilityClasses();
  const { getText } = useTextDetail();

  const containerClasses = useMemo(
    () => cn(styles.container, animationClasses),
    [animationClasses]
  );

  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const loadingClasses = useMemo(
    () => cn(styles.loading, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <div
      className={containerClasses}
      data-testid={testId || 'dashboard-loading-container'}
    >
      <div className={mainClasses}>
        <p
          className={loadingClasses}
          data-testid={testId ? `${testId}-text` : 'dashboard-loading'}
        >
          {getText('dashboard_loading')}
        </p>
      </div>
    </div>
  );
}

DashboardLoading.displayName = 'DashboardLoading';

/**
 * DashboardLoading Styles - MindEase
 * Centralized styles for dashboard loading component
 */

export const styles = {
  container: 'flex min-h-full w-full bg-bg-secondary',
  main: 'flex flex-col w-full max-w-4xl mx-auto',
  loading: 'text-text-secondary text-center',
} as const;
