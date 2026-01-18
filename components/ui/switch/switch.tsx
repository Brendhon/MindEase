'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { ReactNode, useMemo } from 'react';
import { SwitchDescription } from './switch-description';
import { SwitchLabel } from './switch-label';
import { styles } from './switch-styles';
import { SwitchToggle } from './switch-toggle';

/**
 * Switch Component - MindEase
 * Accessible toggle switch with cognitive accessibility features
 *
 * Supports both prop-based API (for simplicity) and composition API (for flexibility):
 *
 * @example
 * ```tsx
 * // Prop-based API (recommended for simple cases)
 * <Switch
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Enable notifications"
 *   description="Receive email notifications"
 * />
 *
 * // Composition API (for custom layouts)
 * <Switch checked={enabled} onChange={setEnabled}>
 *   <Switch.Toggle />
 *   <Switch.Label>Enable notifications</Switch.Label>
 *   <Switch.Description>Receive email notifications</Switch.Description>
 * </Switch>
 * ```
 */
export interface SwitchProps extends BaseComponentProps {
  /** Switch content (Switch subcomponents when using composition API) */
  children?: ReactNode;

  /** Custom className for container */
  className?: string;
}

function SwitchRoot({
  className,
  'data-testid': testId,
  children,
}: SwitchProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  const { spacingClasses } = useAccessibilityClasses();

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap, className),
    [spacingClasses.gap, className]
  );

  return (
    <div
      className={containerClasses}
      data-testid={testId || 'switch-container'}
    >
      {children}
    </div>
  );
}

SwitchRoot.displayName = 'Switch';

// Compose Switch with subcomponents
export const Switch = Object.assign(SwitchRoot, {
  Toggle: SwitchToggle,
  Label: SwitchLabel,
  Description: SwitchDescription,
});
