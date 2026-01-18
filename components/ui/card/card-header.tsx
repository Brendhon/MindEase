'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { useCognitiveSettings } from '@/hooks/cognitive-settings';
import { BaseComponentProps } from '@/models/base';
import { getBorderContrastClasses } from '@/utils/accessibility';
import { cn } from '@/utils/ui';
import { ReactNode, useMemo } from 'react';
import { styles } from './card-styles';

/**
 * Card.Header - Header subcomponent
 * Use this for consistent header styling within cards
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *   </Card.Header>
 * </Card>
 * ```
 */
export interface CardHeaderProps extends BaseComponentProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({
  children,
  className,
  'data-testid': testId,
}: CardHeaderProps) {
  const { settings } = useCognitiveSettings();
  const { spacingClasses } = useAccessibilityClasses();

  const borderClasses = useMemo(
    () => getBorderContrastClasses(settings.contrast, 'subtle'),
    [settings.contrast]
  );

  const headerClasses = useMemo(
    () => cn(styles.header, spacingClasses.gap, borderClasses, className),
    [spacingClasses.gap, borderClasses, className]
  );

  return (
    <div className={headerClasses} data-testid={testId}>
      {children}
    </div>
  );
}

CardHeader.displayName = 'Card.Header';
