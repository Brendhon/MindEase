'use client';

import { Button } from '@/components/ui';
import { useTextDetail } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { LogOut, Trash2 } from 'lucide-react';
import { useAccessibilityClasses } from '@/hooks/accessibility';
import { useMemo } from 'react';
import { styles } from './profile-info-styles';

/**
 * ProfileActions Component - MindEase
 * Displays action buttons for profile (logout and delete account)
 */
export interface ProfileActionsProps extends BaseComponentProps {
  /** Handler for logout action */
  onLogout: () => void;

  /** Handler for delete account action */
  onDeleteAccount: () => void;

  /** Additional CSS classes */
  className?: string;
}

export function ProfileActions({
  onLogout,
  onDeleteAccount,
  className,
  'data-testid': testId,
}: ProfileActionsProps) {
  const { getText } = useTextDetail();
  const { spacingClasses, animationClasses } = useAccessibilityClasses();

  // Generate accessible classes with memoization
  const actionsClasses = useMemo(
    () => cn(styles.actions, spacingClasses.gap, animationClasses, className),
    [spacingClasses.gap, animationClasses, className]
  );

  return (
    <div className={actionsClasses} data-testid={testId}>
      <Button
        variant="secondary"
        size="md"
        onClick={onLogout}
        aria-label={getText('logout')}
        data-testid={
          testId ? `${testId}-logout-button` : 'profile-logout-button'
        }
      >
        <Button.Icon icon={LogOut} position="left" size="md" />
        <Button.Text>{getText('logout')}</Button.Text>
      </Button>
      <Button
        variant="danger"
        size="md"
        onClick={onDeleteAccount}
        aria-label={getText('profile_delete_account_aria')}
        data-testid={
          testId
            ? `${testId}-delete-account-button`
            : 'profile-delete-account-button'
        }
      >
        <Button.Icon icon={Trash2} position="left" size="md" />
        <Button.Text>{getText('profile_delete_account')}</Button.Text>
      </Button>
    </div>
  );
}

ProfileActions.displayName = 'ProfileActions';
