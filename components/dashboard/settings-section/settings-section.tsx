'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { BaseComponentProps } from '@/models/base';

/**
 * SettingsSection Component - MindEase
 * Reusable section container for settings page
 *
 * @example
 * ```tsx
 * <SettingsSection title="Visual Settings" description="Adjust visual preferences">
 *   <Switch ... />
 * </SettingsSection>
 * ```
 */
export interface SettingsSectionProps extends BaseComponentProps {
  /** Section title */
  title: string;

  /** Optional section description */
  description?: string;

  /** Section content */
  children: ReactNode;

  /** Custom className */
  className?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
  'data-testid': testId,
}: SettingsSectionProps) {
  return (
    <Card
      as="section"
      className={className}
      data-testid={testId || 'settings-section'}
    >
      <Card.Header>
        <Card.Title
          data-testid={testId ? `${testId}-title` : 'settings-section-title'}
        >
          {title}
        </Card.Title>
        {description && (
          <Card.Description
            data-testid={
              testId ? `${testId}-description` : 'settings-section-description'
            }
          >
            {description}
          </Card.Description>
        )}
      </Card.Header>
      <Card.Content
        data-testid={testId ? `${testId}-content` : 'settings-section-content'}
      >
        {children}
      </Card.Content>
    </Card>
  );
}

SettingsSection.displayName = 'SettingsSection';
