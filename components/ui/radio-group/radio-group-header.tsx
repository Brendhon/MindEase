'use client';

import { BaseComponentProps } from '@/models/base';
import { ReactNode } from 'react';
import { cn } from '@/utils/ui';
import { styles } from './radio-group-styles';

/**
 * RadioGroup.Header - Header wrapper subcomponent
 * Encapsulates the standard header layout for Label and Description
 *
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected}>
 *   <RadioGroup.Header>
 *     <RadioGroup.Label>Choose option</RadioGroup.Label>
 *     <RadioGroup.Description>Select one option</RadioGroup.Description>
 *   </RadioGroup.Header>
 *   <RadioGroup.Option value="option1" label="Option 1" />
 * </RadioGroup>
 * ```
 */
export interface RadioGroupHeaderProps extends Omit<
  BaseComponentProps,
  'data-testid'
> {
  /** Header content (typically Label and Description) */
  children: ReactNode;

  /** Custom className */
  className?: string;
}

export function RadioGroupHeader({
  children,
  className,
}: RadioGroupHeaderProps) {
  return <div className={cn(styles.header, className)}>{children}</div>;
}

RadioGroupHeader.displayName = 'RadioGroup.Header';
