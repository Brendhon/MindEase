'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { X } from 'lucide-react';

/**
 * Toast.Dismiss - Dismiss button subcomponent
 * Provides a button to manually dismiss the toast
 *
 * @example
 * ```tsx
 * <Toast type="success">
 *   <Toast.Icon />
 *   <Toast.Message>Success message</Toast.Message>
 *   <Toast.Dismiss onDismiss={handleDismiss} />
 * </Toast>
 * ```
 */
export interface ToastDismissProps extends BaseComponentProps {
  onDismiss: () => void;
  ariaLabel?: string;
  className?: string;
}

export function ToastDismiss({
  onDismiss,
  ariaLabel = 'Dismiss message',
  className,
  'data-testid': testId,
}: ToastDismissProps) {
  const { animationClasses } = useAccessibilityClasses();

  return (
    <button
      type="button"
      onClick={onDismiss}
      className={cn(styles.dismissButton, animationClasses, className)}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <X className={styles.dismissIcon} aria-hidden="true" />
    </button>
  );
}

ToastDismiss.displayName = 'Toast.Dismiss';

const styles = {
  dismissButton:
    'flex-shrink-0 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-colors',
  dismissIcon: 'w-4 h-4',
} as const;
