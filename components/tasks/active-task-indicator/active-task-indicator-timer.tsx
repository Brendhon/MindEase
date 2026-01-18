'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { formatTime } from '@/utils/timer';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { styles } from './active-task-indicator-styles';

/**
 * ActiveTaskIndicatorTimer Component - MindEase
 * Displays formatted remaining time
 */
export interface ActiveTaskIndicatorTimerProps extends BaseComponentProps {
  /** Remaining time in seconds */
  remainingTime: number;
}

export function ActiveTaskIndicatorTimer({
  remainingTime,
  'data-testid': testId,
}: ActiveTaskIndicatorTimerProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  // Format time as MM:SS
  const formattedTime = useMemo(() => {
    return formatTime(remainingTime);
  }, [remainingTime]);

  return (
    <p
      className={cn(styles.timer, fontSizeClasses['2xl'])}
      data-testid={testId || 'active-task-indicator-timer'}
      aria-label={`Tempo restante: ${formattedTime}`}
    >
      {formattedTime}
    </p>
  );
}

ActiveTaskIndicatorTimer.displayName = 'ActiveTaskIndicatorTimer';
