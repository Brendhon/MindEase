'use client';

import { useAccessibilityClasses, useTextDetail } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import type { Task } from '@/models/task';
import type { AccessibilityTextKey } from '@/utils/accessibility';
import { normalizeText } from '@/utils/tasks';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { TaskCard } from '../task-card';

/**
 * TaskColumn Component - MindEase
 * Column for tasks in Kanban layout
 */
export interface TaskColumnProps extends BaseComponentProps {
  /** Column title key */
  titleKey: AccessibilityTextKey;

  /** Tasks to display in this column */
  tasks: Task[];

  /** Column status filter (0 = To Do, 1 = In Progress, 2 = Done) */
  status: number;

  /** Search searchTerm */
  searchTerm: string;

  /** Callback when task is edited */
  onEdit?: (task: Task) => void;

  /** Callback when task is deleted */
  onDelete?: (taskId: string) => void;

  /** Callback when task status changes */
  onStatusChange?: (taskId: string, status: number) => void;

  /** Callback when subtask is toggled */
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

export function TaskColumn({
  titleKey,
  tasks,
  status,
  searchTerm,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  'data-testid': testId,
}: TaskColumnProps) {
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  const sortedTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.status === status)
      .filter((task) => {
        if (!searchTerm) return true;
        const normalizedTitle = normalizeText(task.title);
        const normalizedSearch = normalizeText(searchTerm);
        return normalizedTitle.includes(normalizedSearch);
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [tasks, status, searchTerm]);

  const columnClasses = useMemo(
    () => cn(styles.column, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const headerClasses = useMemo(
    () => cn(styles.header, spacingClasses.padding),
    [spacingClasses.padding]
  );

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const countClasses = useMemo(
    () => cn(styles.count, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <div
      className={columnClasses}
      data-testid={testId || `task-column-${status}`}
    >
      <div className={headerClasses}>
        <h2 className={titleClasses}>{getText(titleKey)}</h2>
        <span
          className={countClasses}
          aria-label={`${sortedTasks.length} ${getText('tasks_count_caption')}`}
        >
          {sortedTasks.length} {getText('tasks_count_caption')}
        </span>
      </div>
      <div className={contentClasses}>
        {sortedTasks.length === 0 ? (
          <div
            className={styles.empty}
            data-testid={`${testId || `task-column-${status}`}-empty`}
          >
            <p className={cn(styles.emptyText, fontSizeClasses.sm)}>
              {getText('tasks_empty')}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onToggleSubtask={onToggleSubtask}
              data-testid={`task-column-item-${task.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

TaskColumn.displayName = 'TaskColumn';

const styles = {
  column: 'flex flex-col min-h-[400px] lg:h-full min-w-[280px] lg:min-w-0',
  header:
    'flex flex-col gap-0.5 mb-4 sticky top-0 bg-bg-secondary z-10 pb-2 border-b border-border-subtle',
  title: 'font-semibold text-text-primary',
  count: 'text-text-secondary font-normal',
  content: 'flex flex-col flex-1 gap-4 min-h-0 pb-4',
  empty: 'flex items-center justify-center py-8 text-center',
  emptyText: 'text-text-secondary',
} as const;
