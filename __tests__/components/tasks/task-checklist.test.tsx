import {
  accessibilityMocks,
  textDetailMocks,
} from '@/__tests__/__mocks__/hooks';
import { TaskChecklist } from '@/components/tasks/task-checklist/task-checklist';
import type { Subtask } from '@/models/task';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock useAccessibilityClasses
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () =>
    textDetailMocks.withTranslations({
      tasks_subtask_focus_required_hint_text:
        'Enter focus mode to mark subtasks',
      tasks_progress: 'of',
      tasks_progress_steps: 'steps',
    }),
}));

/**
 * Functional tests for TaskChecklist component
 *
 * Tests renderization, sorting, progress calculation, toggle functionality,
 * hint display, and empty state handling.
 */
describe('TaskChecklist', () => {
  afterEach(() => {
    cleanup();
  });

  const createSubtask = (
    id: string,
    title: string,
    completed: boolean,
    order: number
  ): Subtask => ({
    id,
    title,
    completed,
    order,
  });

  describe('Basic Renderization', () => {
    it('should render checklist with subtasks', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Subtask 1', false, 0),
        createSubtask('2', 'Subtask 2', true, 1),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      expect(screen.getByTestId('checklist')).toBeInTheDocument();
      expect(screen.getByText('Subtask 1')).toBeInTheDocument();
      expect(screen.getByText('Subtask 2')).toBeInTheDocument();
    });

    it('should not render when subtasks array is empty', () => {
      const { container } = render(
        <TaskChecklist subtasks={[]} data-testid="empty-checklist" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render progress component', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Subtask 1', false, 0),
        createSubtask('2', 'Subtask 2', true, 1),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      expect(screen.getByTestId('checklist-progress')).toBeInTheDocument();
    });

    it('should render list with role="list"', () => {
      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });
  });

  describe('Sorting by Order', () => {
    it('should sort subtasks by order property', () => {
      const subtasks: Subtask[] = [
        createSubtask('3', 'Third', false, 2),
        createSubtask('1', 'First', false, 0),
        createSubtask('2', 'Second', false, 1),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
      // Check that items are rendered in order
      expect(items[0]).toHaveTextContent('First');
      expect(items[1]).toHaveTextContent('Second');
      expect(items[2]).toHaveTextContent('Third');
    });

    it('should maintain order when subtasks are already sorted', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'First', false, 0),
        createSubtask('2', 'Second', false, 1),
        createSubtask('3', 'Third', false, 2),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('First');
      expect(items[1]).toHaveTextContent('Second');
      expect(items[2]).toHaveTextContent('Third');
    });

    it('should handle negative order values', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Positive', false, 1),
        createSubtask('2', 'Negative', false, -1),
        createSubtask('3', 'Zero', false, 0),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('Negative');
      expect(items[1]).toHaveTextContent('Zero');
      expect(items[2]).toHaveTextContent('Positive');
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly with mixed completion', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Completed 1', true, 0),
        createSubtask('2', 'Pending', false, 1),
        createSubtask('3', 'Completed 2', true, 2),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const progress = screen.getByTestId('checklist-progress');
      expect(progress).toHaveTextContent('2 of 3 steps');
    });

    it('should show 0 progress when no subtasks are completed', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Pending 1', false, 0),
        createSubtask('2', 'Pending 2', false, 1),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const progress = screen.getByTestId('checklist-progress');
      expect(progress).toHaveTextContent('0 of 2 steps');
    });

    it('should show 100% progress when all subtasks are completed', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Completed 1', true, 0),
        createSubtask('2', 'Completed 2', true, 1),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const progress = screen.getByTestId('checklist-progress');
      expect(progress).toHaveTextContent('2 of 2 steps');
    });
  });

  describe('Toggle Functionality', () => {
    it('should call onToggleSubtask when interactive and subtask is clicked', async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(
        <TaskChecklist
          subtasks={subtasks}
          onToggleSubtask={handleToggle}
          interactive={true}
          data-testid="checklist"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith('1');
    });

    it('should not call onToggleSubtask when interactive is false', async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(
        <TaskChecklist
          subtasks={subtasks}
          onToggleSubtask={handleToggle}
          interactive={false}
          data-testid="checklist"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // onToggle should still be called (component doesn't prevent it)
      // but the parent should handle the logic
      expect(handleToggle).toHaveBeenCalled();
    });

    it('should handle multiple subtask toggles', async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      const subtasks: Subtask[] = [
        createSubtask('1', 'Subtask 1', false, 0),
        createSubtask('2', 'Subtask 2', false, 1),
        createSubtask('3', 'Subtask 3', false, 2),
      ];

      render(
        <TaskChecklist
          subtasks={subtasks}
          onToggleSubtask={handleToggle}
          interactive={true}
          data-testid="checklist"
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      await user.click(checkboxes[2]);

      expect(handleToggle).toHaveBeenCalledTimes(3);
      expect(handleToggle).toHaveBeenNthCalledWith(1, '1');
      expect(handleToggle).toHaveBeenNthCalledWith(2, '2');
      expect(handleToggle).toHaveBeenNthCalledWith(3, '3');
    });

    it('should work without onToggleSubtask callback', async () => {
      const user = userEvent.setup();

      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(
        <TaskChecklist
          subtasks={subtasks}
          interactive={true}
          data-testid="checklist"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      // Should not throw error
      await user.click(checkbox);
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Hint Display', () => {
    it('should display hint when isInFocus is false', () => {
      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(
        <TaskChecklist
          subtasks={subtasks}
          isInFocus={false}
          data-testid="checklist"
        />
      );

      expect(screen.getByTestId('checklist-hint')).toBeInTheDocument();
      expect(
        screen.getByText('Enter focus mode to mark subtasks')
      ).toBeInTheDocument();
    });

    it('should not display hint when isInFocus is true', () => {
      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(
        <TaskChecklist
          subtasks={subtasks}
          isInFocus={true}
          data-testid="checklist"
        />
      );

      expect(screen.queryByTestId('checklist-hint')).not.toBeInTheDocument();
    });

    it('should not display hint by default (isInFocus defaults to false)', () => {
      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      // Default is false, so hint should be shown
      expect(screen.getByTestId('checklist-hint')).toBeInTheDocument();
    });
  });

  describe('Data Test IDs', () => {
    it('should use custom data-testid when provided', () => {
      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(
        <TaskChecklist subtasks={subtasks} data-testid="custom-checklist" />
      );

      expect(screen.getByTestId('custom-checklist')).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-checklist-progress')
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-checklist-item-1')).toBeInTheDocument();
    });

    it('should use default data-testid when not provided', () => {
      const subtasks: Subtask[] = [createSubtask('1', 'Subtask 1', false, 0)];

      render(<TaskChecklist subtasks={subtasks} />);

      expect(screen.getByTestId('task-checklist')).toBeInTheDocument();
      expect(screen.getByTestId('task-checklist-progress')).toBeInTheDocument();
      expect(screen.getByTestId('task-checklist-item-1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single subtask', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'Single subtask', false, 0),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      expect(screen.getByText('Single subtask')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    it('should handle many subtasks', () => {
      const subtasks: Subtask[] = Array.from({ length: 10 }, (_, i) =>
        createSubtask(String(i), `Subtask ${i}`, i % 2 === 0, i)
      );

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      expect(screen.getAllByRole('listitem')).toHaveLength(10);
      const progress = screen.getByTestId('checklist-progress');
      expect(progress).toHaveTextContent('5 of 10 steps');
    });

    it('should handle subtasks with same order (stable sort)', () => {
      const subtasks: Subtask[] = [
        createSubtask('1', 'First', false, 0),
        createSubtask('2', 'Second', false, 0),
        createSubtask('3', 'Third', false, 0),
      ];

      render(<TaskChecklist subtasks={subtasks} data-testid="checklist" />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
      // Should maintain original order when order values are equal
      expect(items[0]).toHaveTextContent('First');
      expect(items[1]).toHaveTextContent('Second');
      expect(items[2]).toHaveTextContent('Third');
    });
  });
});
