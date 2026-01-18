'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import type { Task } from '@/models/task';
import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { styles } from './active-task-indicator-styles';

/**
 * ActiveTaskIndicatorTaskText Component - MindEase
 * Displays task title and description text
 */
export interface ActiveTaskIndicatorTaskTextProps extends BaseComponentProps {
  /** Task object or null */
  task: Task | null;
}

export function ActiveTaskIndicatorTaskText({
  task,
  'data-testid': testId,
}: ActiveTaskIndicatorTaskTextProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  return (
    <div
      className={styles.textContainer}
      data-testid={testId || 'active-task-indicator-task-text'}
    >
      {task?.title ? (
        <p className={cn(styles.title, fontSizeClasses.base)}>{task.title}</p>
      ) : null}

      {task?.description && (
        <p className={cn(styles.description, fontSizeClasses.sm)}>
          {task.description}
        </p>
      )}
    </div>
  );
}

ActiveTaskIndicatorTaskText.displayName = 'ActiveTaskIndicatorTaskText';
