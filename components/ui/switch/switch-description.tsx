'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { styles } from './switch-styles';

/**
 * Switch.Description - Description subcomponent
 *
 * @example
 * ```tsx
 * <Switch checked={enabled} onChange={setEnabled}>
 *   <Switch.Toggle />
 *   <Switch.Label>Enable notifications</Switch.Label>
 *   <Switch.Description>Receive email notifications</Switch.Description>
 * </Switch>
 * ```
 */
export interface SwitchDescriptionProps extends BaseComponentProps {
  /** Description text */
  children: string;

  /** HTML id attribute for accessibility */
  id?: string;
}

export function SwitchDescription({
  children,
  id,
  'data-testid': testId,
}: SwitchDescriptionProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <p
      id={id}
      className={descriptionClasses}
      data-testid={testId || 'switch-description'}
    >
      {children}
    </p>
  );
}

SwitchDescription.displayName = 'Switch.Description';
