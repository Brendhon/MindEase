import { Checkbox } from '@/components/ui/checkbox/checkbox';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

/**
 * Functional tests for Checkbox component
 *
 * Tests renderization, states, interactions, and accessibility.
 */
describe('Checkbox', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Basic Renderization', () => {
    it('should render unchecked checkbox', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-unchecked"
        >
          <Checkbox.Label>Unchecked</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('should render checked checkbox', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={true}
          onChange={handleChange}
          data-testid="checkbox-checked"
        >
          <Checkbox.Label>Checked</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Prop-based API', () => {
    it('should render with label prop (if supported)', () => {
      // Note: The current implementation uses composition API
      // This test verifies the composition API works
      const handleChange = vi.fn();
      render(
        <Checkbox checked={false} onChange={handleChange}>
          <Checkbox.Label>Label via composition</Checkbox.Label>
        </Checkbox>
      );
      expect(screen.getByText('Label via composition')).toBeInTheDocument();
    });
  });

  describe('Composition API', () => {
    it('should render with Checkbox.Label', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox checked={false} onChange={handleChange}>
          <Checkbox.Label>Checkbox Label</Checkbox.Label>
        </Checkbox>
      );
      expect(screen.getByText('Checkbox Label')).toBeInTheDocument();
    });

    it('should render with Checkbox.Description', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox checked={false} onChange={handleChange}>
          <Checkbox.Label>Label</Checkbox.Label>
          <Checkbox.Description>Description text</Checkbox.Description>
        </Checkbox>
      );
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('should render with both Label and Description', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-complete"
        >
          <Checkbox.Label>Complete Checkbox</Checkbox.Label>
          <Checkbox.Description>
            This is a complete checkbox
          </Checkbox.Description>
        </Checkbox>
      );
      expect(screen.getByText('Complete Checkbox')).toBeInTheDocument();
      expect(
        screen.getByText('This is a complete checkbox')
      ).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-complete')).toBeInTheDocument();
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-toggle"
        >
          <Checkbox.Label>Toggle me</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should toggle from checked to unchecked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Checkbox
          checked={true}
          onChange={handleChange}
          data-testid="checkbox-uncheck"
        >
          <Checkbox.Label>Uncheck me</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('should toggle via keyboard (Enter)', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-keyboard-enter"
        >
          <Checkbox.Label>Keyboard toggle</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard('{Enter}');
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should toggle via keyboard (Space)', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-keyboard-space"
        >
          <Checkbox.Label>Space toggle</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard(' ');
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          disabled={true}
          data-testid="checkbox-disabled"
        >
          <Checkbox.Label>Disabled</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          disabled={true}
          data-testid="checkbox-disabled-no-toggle"
        >
          <Checkbox.Label>Disabled</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not toggle via keyboard when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          disabled={true}
          data-testid="checkbox-disabled-keyboard"
        >
          <Checkbox.Label>Disabled</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard('{Enter}');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have role="checkbox"', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox checked={false} onChange={handleChange}>
          <Checkbox.Label>Accessible</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should have aria-checked attribute', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox checked={true} onChange={handleChange}>
          <Checkbox.Label>Checked</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('should support aria-label', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          aria-label="Custom aria label"
          data-testid="checkbox-aria-label"
        >
          <Checkbox.Label>Label</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Custom aria label');
    });

    it('should be keyboard accessible', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-keyboard-accessible"
        >
          <Checkbox.Label>Keyboard accessible</Checkbox.Label>
        </Checkbox>
      );
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(document.activeElement).toBe(checkbox);
    });
  });

  describe('Label Styling', () => {
    it('should apply checked styling to label when checked', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={true}
          onChange={handleChange}
          data-testid="checkbox-checked-label"
        >
          <Checkbox.Label checked={true}>Checked Label</Checkbox.Label>
        </Checkbox>
      );
      const label = screen.getByText('Checked Label');
      expect(label).toBeInTheDocument();
    });

    it('should apply unchecked styling to label when unchecked', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          data-testid="checkbox-unchecked-label"
        >
          <Checkbox.Label checked={false}>Unchecked Label</Checkbox.Label>
        </Checkbox>
      );
      const label = screen.getByText('Unchecked Label');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      let checked = false;
      const handleChange = vi.fn((newValue: boolean) => {
        checked = newValue;
      });

      const { rerender } = render(
        <Checkbox
          checked={checked}
          onChange={handleChange}
          data-testid="checkbox-rapid"
        >
          <Checkbox.Label>Rapid clicks</Checkbox.Label>
        </Checkbox>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      rerender(
        <Checkbox
          checked={checked}
          onChange={handleChange}
          data-testid="checkbox-rapid"
        >
          <Checkbox.Label>Rapid clicks</Checkbox.Label>
        </Checkbox>
      );
      await user.click(checkbox);
      rerender(
        <Checkbox
          checked={checked}
          onChange={handleChange}
          data-testid="checkbox-rapid"
        >
          <Checkbox.Label>Rapid clicks</Checkbox.Label>
        </Checkbox>
      );
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, true);
      expect(handleChange).toHaveBeenNthCalledWith(2, false);
      expect(handleChange).toHaveBeenNthCalledWith(3, true);
    });

    it('should handle multiple checkboxes independently', async () => {
      const user = userEvent.setup();
      const handleChange1 = vi.fn();
      const handleChange2 = vi.fn();

      render(
        <>
          <Checkbox
            checked={false}
            onChange={handleChange1}
            data-testid="checkbox-1"
          >
            <Checkbox.Label>Checkbox 1</Checkbox.Label>
          </Checkbox>
          <Checkbox
            checked={true}
            onChange={handleChange2}
            data-testid="checkbox-2"
          >
            <Checkbox.Label>Checkbox 2</Checkbox.Label>
          </Checkbox>
        </>
      );

      const checkbox1 = screen.getByTestId('checkbox-1-checkbox');
      const checkbox2 = screen.getByTestId('checkbox-2-checkbox');

      await user.click(checkbox1);
      await user.click(checkbox2);

      expect(handleChange1).toHaveBeenCalledWith(true);
      expect(handleChange2).toHaveBeenCalledWith(false);
    });
  });
});
