import { TaskChecklistProgress } from '@/components/tasks/task-checklist/task-checklist-progress';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';

// Mock useAccessibilityClasses
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => ({
    spacingClasses: {
      padding: 'p-4',
      gap: 'gap-2',
      margin: 'm-4',
    },
    fontSizeClasses: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    contrastClasses: 'contrast-normal',
    animationClasses: 'animate-normal',
  }),
  useTextDetail: () => ({
    getText: (key: string) => {
      const translations: Record<string, string> = {
        tasks_progress: 'of',
        tasks_progress_steps: 'steps',
      };
      return translations[key] || key;
    },
  }),
}));

/**
 * Functional tests for TaskChecklistProgress component
 *
 * Tests progress display, text formatting, and edge cases.
 */
describe('TaskChecklistProgress', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Progress Display', () => {
    it('should display progress correctly', () => {
      render(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={5}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveTextContent('2 of 5 steps');
    });

    it('should display zero progress', () => {
      render(
        <TaskChecklistProgress
          completedCount={0}
          totalCount={3}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('0 of 3 steps');
    });

    it('should display full progress', () => {
      render(
        <TaskChecklistProgress
          completedCount={5}
          totalCount={5}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('5 of 5 steps');
    });

    it('should display partial progress', () => {
      render(
        <TaskChecklistProgress
          completedCount={3}
          totalCount={7}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('3 of 7 steps');
    });
  });

  describe('Text Formatting', () => {
    it('should format progress text correctly', () => {
      render(
        <TaskChecklistProgress
          completedCount={1}
          totalCount={1}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress.textContent).toBe('1 of 1 steps');
    });

    it('should use correct translation keys', () => {
      render(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={4}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      // Should contain "of" and "steps" from translations
      expect(progress.textContent).toContain('of');
      expect(progress.textContent).toContain('steps');
    });

    it('should handle large numbers', () => {
      render(
        <TaskChecklistProgress
          completedCount={100}
          totalCount={150}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('100 of 150 steps');
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0/0 case (no subtasks)', () => {
      render(
        <TaskChecklistProgress
          completedCount={0}
          totalCount={0}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('0 of 0 steps');
    });

    it('should handle 0/5 case (no completed)', () => {
      render(
        <TaskChecklistProgress
          completedCount={0}
          totalCount={5}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('0 of 5 steps');
    });

    it('should handle 5/5 case (all completed)', () => {
      render(
        <TaskChecklistProgress
          completedCount={5}
          totalCount={5}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('5 of 5 steps');
    });

    it('should handle completedCount greater than totalCount (invalid state)', () => {
      render(
        <TaskChecklistProgress
          completedCount={10}
          totalCount={5}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      // Component should still render, even with invalid state
      expect(progress).toHaveTextContent('10 of 5 steps');
    });

    it('should handle single subtask', () => {
      render(
        <TaskChecklistProgress
          completedCount={1}
          totalCount={1}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('1 of 1 steps');
    });

    it('should handle single incomplete subtask', () => {
      render(
        <TaskChecklistProgress
          completedCount={0}
          totalCount={1}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('0 of 1 steps');
    });
  });

  describe('Data Test IDs', () => {
    it('should use custom data-testid when provided', () => {
      render(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={5}
          data-testid="custom-progress"
        />
      );

      expect(screen.getByTestId('custom-progress')).toBeInTheDocument();
    });

    it('should use default data-testid when not provided', () => {
      render(<TaskChecklistProgress completedCount={2} totalCount={5} />);

      expect(screen.getByTestId('task-checklist-progress')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render as paragraph element', () => {
      render(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={5}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress.tagName).toBe('P');
    });

    it('should have accessible text content', () => {
      render(
        <TaskChecklistProgress
          completedCount={3}
          totalCount={7}
          data-testid="progress"
        />
      );

      const progress = screen.getByTestId('progress');
      expect(progress.textContent).toBeTruthy();
      expect(progress.textContent).toContain('3');
      expect(progress.textContent).toContain('7');
    });
  });

  describe('Re-rendering', () => {
    it('should update when completedCount changes', () => {
      const { rerender } = render(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={5}
          data-testid="progress"
        />
      );

      let progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('2 of 5 steps');

      rerender(
        <TaskChecklistProgress
          completedCount={4}
          totalCount={5}
          data-testid="progress"
        />
      );

      progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('4 of 5 steps');
    });

    it('should update when totalCount changes', () => {
      const { rerender } = render(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={5}
          data-testid="progress"
        />
      );

      let progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('2 of 5 steps');

      rerender(
        <TaskChecklistProgress
          completedCount={2}
          totalCount={10}
          data-testid="progress"
        />
      );

      progress = screen.getByTestId('progress');
      expect(progress).toHaveTextContent('2 of 10 steps');
    });
  });
});
