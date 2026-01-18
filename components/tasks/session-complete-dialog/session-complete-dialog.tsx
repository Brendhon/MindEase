'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useAccessibilityClasses } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

/**
 * SessionAction interface - MindEase
 * Configuration for a single action button in the session complete dialog
 */
export interface SessionAction {
  /** Unique identifier for the action */
  id: string;

  /** Button variant */
  variant: 'primary' | 'secondary';

  /** Icon component from lucide-react */
  icon: LucideIcon;

  /** Button text */
  text: string;

  /** ARIA label for accessibility */
  ariaLabel: string;

  /** Click handler */
  onClick: () => void;

  /** Test ID for testing */
  testId: string;

  /** Optional condition to show/hide the action (defaults to true) */
  condition?: boolean;
}

/**
 * SessionCompleteDialogProps interface - MindEase
 * Props for the generic session complete dialog component
 */
export interface SessionCompleteDialogProps extends BaseComponentProps {
  /** Whether dialog is open */
  isOpen: boolean;

  /** Callback when dialog is closed */
  onClose: () => void;

  /** Dialog title */
  title: string;

  /** Main message text */
  message: string;

  /** Question text displayed below message */
  question: string;

  /** Array of action buttons to display */
  actions: SessionAction[];
}

/**
 * SessionCompleteDialog Component - MindEase
 * Generic dialog component for session completion dialogs
 * Provides consistent structure and styling for break and focus session dialogs
 */
export function SessionCompleteDialog({
  isOpen,
  onClose,
  title,
  message,
  question,
  actions,
  'data-testid': testId,
}: SessionCompleteDialogProps) {
  const { spacingClasses, fontSizeClasses } = useAccessibilityClasses();

  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const messageClasses = useMemo(
    () => cn(styles.message, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const actionsClasses = useMemo(
    () => cn(styles.actions, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Filter actions based on condition
  const visibleActions = useMemo(
    () => actions.filter((action) => action.condition !== false),
    [actions]
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      preventClose={true}
      data-testid={testId}
    >
      <div className={contentClasses}>
        <p className={messageClasses}>{message}</p>

        <p className={cn(styles.question, fontSizeClasses.base)}>{question}</p>

        <div className={actionsClasses}>
          {visibleActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.onClick}
              aria-label={action.ariaLabel}
              data-testid={action.testId}
              className={styles.button}
            >
              <Button.Icon icon={action.icon} position="left" />
              <Button.Text>{action.text}</Button.Text>
            </Button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

SessionCompleteDialog.displayName = 'SessionCompleteDialog';

const styles = {
  content: 'flex flex-col',
  message: 'text-text-primary mb-2',
  question: 'text-text-secondary mb-4 font-medium',
  actions: 'flex flex-col gap-2 mt-2',
  button: 'w-full justify-start',
} as const;
