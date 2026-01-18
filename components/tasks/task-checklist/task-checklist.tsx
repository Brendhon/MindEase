'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { useTextDetail } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import type { Subtask } from '@/models/task';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { TaskChecklistItem } from './task-checklist-item';
import { TaskChecklistProgress } from './task-checklist-progress';

/**
 * TaskChecklist Component - MindEase
 * Displays checklist of subtasks with completion status
 */
export interface TaskChecklistProps extends BaseComponentProps {
  /** Array of subtasks */
  subtasks: Subtask[];

  /** Callback when subtask is toggled */
  onToggleSubtask?: (subtaskId: string) => void;

  /** Whether checklist is interactive */
  interactive?: boolean;

  /** Whether task is in focus (to show hint text) */
  isInFocus?: boolean;
}

export function TaskChecklist({
  subtasks,
  onToggleSubtask,
  interactive = false,
  isInFocus = false,
  'data-testid': testId,
}: TaskChecklistProps) {
  const { spacingClasses, fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  // Sort subtasks by order
  const sortedSubtasks = useMemo(() => {
    return [...subtasks].sort((a, b) => a.order - b.order);
  }, [subtasks]);

  // Calculate progress
  const completedCount = useMemo(() => {
    return subtasks.filter((st) => st.completed).length;
  }, [subtasks]);

  const totalCount = subtasks.length;

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  if (subtasks.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses} data-testid={testId || 'task-checklist'}>
      <TaskChecklistProgress
        completedCount={completedCount}
        totalCount={totalCount}
        data-testid={`${testId || 'task-checklist'}-progress`}
      />
      <ul className={styles.list} role="list">
        {sortedSubtasks.map((subtask) => {
          return (
            <TaskChecklistItem
              key={subtask.id}
              subtask={subtask}
              interactive={interactive}
              onToggle={onToggleSubtask}
              data-testid={`${testId || 'task-checklist'}-item-${subtask.id}`}
            />
          );
        })}
      </ul>
      {!isInFocus && (
        <p
          className={cn(styles.hint, fontSizeClasses.sm)}
          data-testid={`${testId || 'task-checklist'}-hint`}
        >
          {getText('tasks_subtask_focus_required_hint_text')}
        </p>
      )}
    </div>
  );
}

TaskChecklist.displayName = 'TaskChecklist';

const styles = {
  container: 'flex flex-col',
  list: 'flex flex-col list-none p-0 m-0 gap-2',
  hint: 'text-text-secondary italic mt-2',
} as const;
