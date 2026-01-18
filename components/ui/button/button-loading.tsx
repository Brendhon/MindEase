'use client';

import { BaseComponentProps } from '@/models/base';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/ui';
import { styles } from './button-styles';

/**
 * Button.Loading - Loading indicator subcomponent
 * Use this for custom loading states
 *
 * @example
 * ```tsx
 * <Button variant="primary" isLoading>
 *   <Button.Loading />
 *   <Button.Text>Saving...</Button.Text>
 * </Button>
 * ```
 */
export interface ButtonLoadingProps extends Omit<
  BaseComponentProps,
  'data-testid'
> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export function ButtonLoading({
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Loading',
}: ButtonLoadingProps) {
  return (
    <Loader2
      className={cn(styles.loading.spinner, styles.icon.sizes[size], className)}
      aria-label={ariaLabel}
      role="status"
      aria-hidden="false"
    />
  );
}

ButtonLoading.displayName = 'Button.Loading';
