'use client';

import { Input } from '@/components/form/input';
import { InputField } from '@/components/form/input/input-field';
import { useAccessibilityClasses, useTextDetail } from '@/hooks/accessibility';
import { BaseComponentProps } from '@/models/base';
import type { Task } from '@/models/task';
import { cn } from '@/utils/ui';
import { XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TaskColumn } from '../task-column';

/**
 * TaskList Component - MindEase
 * Kanban board with columns for tasks
 */
export interface TaskListProps extends BaseComponentProps {
  /** Array of tasks to display */
  tasks: Task[];

  /** Callback when task is edited */
  onEdit?: (task: Task) => void;

  /** Callback when task is deleted */
  onDelete?: (taskId: string) => void;

  /** Callback when task status changes */
  onStatusChange?: (taskId: string, status: number) => void;

  /** Callback when subtask is toggled */
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  'data-testid': testId,
}: TaskListProps) {
  const { spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();
  const [searchTerm, setSearchTerm] = useState('');

  const containerClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Check if all columns are empty
  const hasTasks = tasks.length > 0;

  if (!hasTasks) {
    return (
      <div
        className={styles.empty}
        data-testid={`${testId || 'task-list'}-empty`}
      >
        <p className={styles.emptyText}>{getText('tasks_empty')}</p>
        <p className={styles.emptyDescription}>{getText('tasks_empty_desc')}</p>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid={testId || 'task-list'}>
      <div className={styles.searchContainer}>
        <Input className={styles.search}>
          <InputField
            placeholder={getText('tasks_search_caption')}
            className={styles.searchInput}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Input>
        <span className={styles.containerIcon}>
          <XIcon
            onClick={() => setSearchTerm('')}
            className={styles.searchIcon}
          />
        </span>
      </div>

      <div className={containerClasses} data-testid={testId || 'task-list'}>
        {/* To Do Column */}
        <TaskColumn
          titleKey="tasks_column_todo"
          tasks={tasks}
          searchTerm={searchTerm}
          status={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleSubtask={onToggleSubtask}
          data-testid="task-column-todo"
        />

        {/* In Progress Column */}
        <TaskColumn
          titleKey="tasks_column_in_progress"
          tasks={tasks}
          searchTerm={searchTerm}
          status={1}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleSubtask={onToggleSubtask}
          data-testid="task-column-in-progress"
        />

        {/* Done Column */}
        <TaskColumn
          titleKey="tasks_column_done"
          tasks={tasks}
          searchTerm={searchTerm}
          status={2}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleSubtask={onToggleSubtask}
          data-testid="task-column-done"
        />
      </div>
    </div>
  );
}

TaskList.displayName = 'TaskList';

const styles = {
  container: 'flex flex-col gap-4',
  content:
    'grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full auto-rows-min overflow-x-auto lg:overflow-x-visible',
  empty:
    'flex flex-col items-center justify-center py-12 text-center col-span-full',
  emptyText: 'text-text-primary text-lg font-semibold mb-2',
  emptyDescription: 'text-text-secondary',
  searchContainer: 'flex flex-col relative',
  containerIcon: 'absolute h-full flex items-center justify-end top-2 right-2',
  searchIcon:
    'w-5 h-5 cursor-pointer text-text-secondary hover:text-text-primary',
  search: 'w-full mt-4',
  searchInput: 'w-full border-border-subtle outline-none pr-8',
} as const;
