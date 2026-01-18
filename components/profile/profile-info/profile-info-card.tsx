'use client';

import { Card } from '@/components/ui';
import { useAccessibilityClasses } from '@/hooks/accessibility';
import { useCognitiveSettings } from '@/hooks/cognitive-settings';
import { AuthUser } from '@/models/auth';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { ProfileAvatar } from './profile-avatar';
import { ProfileInfoRow } from './profile-info-row';
import { getContrastClassesForProfile, styles } from './profile-info-styles';

/**
 * ProfileInfoCard Component - MindEase
 * Displays user information in a card format
 */
export interface ProfileInfoCardProps extends BaseComponentProps {
  /** User data */
  user: AuthUser | null;

  /** Label CSS classes */
  labelClassName?: string;

  /** Value CSS classes */
  valueClassName?: string;

  /** Additional CSS classes */
  className?: string;
}

export function ProfileInfoCard({
  user,
  labelClassName,
  valueClassName,
  className,
  'data-testid': testId,
}: ProfileInfoCardProps) {
  const { spacingClasses, animationClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();

  // Generate accessible classes with memoization
  const cardClasses = useMemo(
    () =>
      cn(
        styles.infoCard,
        spacingClasses.gap,
        animationClasses,
        getContrastClassesForProfile(settings.contrast, 'card'),
        className
      ),
    [spacingClasses.gap, animationClasses, settings.contrast, className]
  );

  const infoSectionClasses = useMemo(
    () => cn(styles.infoSection, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <Card className={cardClasses} data-testid={testId}>
      <div className={styles.avatarSection}>
        <ProfileAvatar
          image={user?.image || null}
          name={user?.name || null}
          data-testid={testId ? `${testId}-avatar` : 'profile-avatar'}
        />
      </div>

      <div className={infoSectionClasses}>
        {user?.name && (
          <ProfileInfoRow
            labelKey="profile_info_name"
            value={user?.name}
            labelClassName={labelClassName}
            valueClassName={valueClassName}
            data-testid={testId ? `${testId}-name-row` : 'profile-name-row'}
          />
        )}

        <ProfileInfoRow
          labelKey="profile_info_email"
          value={user?.email || ''}
          labelClassName={labelClassName}
          valueClassName={valueClassName}
          data-testid={testId ? `${testId}-email-row` : 'profile-email-row'}
        />
      </div>
    </Card>
  );
}

ProfileInfoCard.displayName = 'ProfileInfoCard';
