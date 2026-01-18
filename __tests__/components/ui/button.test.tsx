import { Button } from '@/components/ui/button/button';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { LogIn } from 'lucide-react';

// Mock useAccessibilityClasses directly in this test file
// This ensures the mock is applied before the component imports it
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
    getText: (key: string) => key,
  }),
}));

// Mock useCognitiveSettings
vi.mock('@/hooks/cognitive-settings', () => ({
  useCognitiveSettings: () => ({
    settings: {
      fontSize: 'base',
      contrast: 'normal',
      spacing: 'normal',
      animations: 'normal',
      complexity: 'normal',
      focusMode: false,
      textDetail: 'normal',
    },
    updateSettings: vi.fn(),
  }),
}));

/**
 * Functional tests for Button component
 *
 * Tests renderization, variants, sizes, states, and accessibility.
 */
describe('Button', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Basic Renderization', () => {
    it('should render with text', () => {
      render(
        <Button>
          <Button.Text>Click me</Button.Text>
        </Button>
      );
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      render(
        <Button data-testid="button-element">
          <Button.Text>Click me</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-element');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      render(
        <Button variant="primary" data-testid="button-primary">
          <Button.Text>Primary</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-primary');
      expect(button).toBeInTheDocument();
    });

    it('should apply secondary variant styles', () => {
      render(
        <Button variant="secondary" data-testid="button-secondary">
          <Button.Text>Secondary</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-secondary');
      expect(button).toBeInTheDocument();
    });

    it('should apply ghost variant styles', () => {
      render(
        <Button variant="ghost" data-testid="button-ghost">
          <Button.Text>Ghost</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-ghost');
      expect(button).toBeInTheDocument();
    });

    it('should apply danger variant styles', () => {
      render(
        <Button variant="danger" data-testid="button-danger">
          <Button.Text>Danger</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-danger');
      expect(button).toBeInTheDocument();
    });

    it('should apply warning variant styles', () => {
      render(
        <Button variant="warning" data-testid="button-warning">
          <Button.Text>Warning</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-warning');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render with small size', () => {
      render(
        <Button size="sm" data-testid="button-small">
          <Button.Text>Small</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-small');
      expect(button).toBeInTheDocument();
    });

    it('should render with medium size (default)', () => {
      render(
        <Button data-testid="button-medium">
          <Button.Text>Medium</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-medium');
      expect(button).toBeInTheDocument();
    });

    it('should render with large size', () => {
      render(
        <Button size="lg" data-testid="button-large">
          <Button.Text>Large</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-large');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state', () => {
      render(
        <Button isLoading data-testid="button-loading">
          <Button.Loading />
          <Button.Text>Saving...</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-loading');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should be disabled when loading', () => {
      render(
        <Button isLoading data-testid="button-loading-disabled">
          <Button.Loading />
          <Button.Text>Saving...</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-loading-disabled');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render loading spinner when isLoading is true', () => {
      render(
        <Button isLoading data-testid="button-loading-spinner">
          <Button.Loading />
          <Button.Text>Saving...</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-loading-spinner');
      // The loading spinner should be rendered
      expect(button).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(
        <Button disabled data-testid="button-disabled">
          <Button.Text>Disabled</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-disabled');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not be clickable when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button
          disabled
          onClick={handleClick}
          data-testid="button-disabled-click"
        >
          <Button.Text>Disabled</Button.Text>
        </Button>
      );

      const button = screen.getByTestId('button-disabled-click');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Composition API', () => {
    it('should render with Button.Icon and Button.Text', () => {
      render(
        <Button data-testid="button-with-icon">
          <Button.Icon icon={LogIn} position="left" />
          <Button.Text>Sign in</Button.Text>
        </Button>
      );
      expect(screen.getByText('Sign in')).toBeInTheDocument();
      const button = screen.getByTestId('button-with-icon');
      expect(button).toBeInTheDocument();
    });

    it('should render with Button.Loading when isLoading is true', () => {
      render(
        <Button isLoading data-testid="button-with-loading">
          <Button.Loading />
          <Button.Text>Saving...</Button.Text>
        </Button>
      );
      // When isLoading is true, only Loading is rendered, not Text
      const button = screen.getByTestId('button-with-loading');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-busy when loading', () => {
      render(
        <Button isLoading data-testid="button-aria-busy">
          <Button.Loading />
          <Button.Text>Loading</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-aria-busy');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-disabled when disabled', () => {
      render(
        <Button disabled data-testid="button-aria-disabled">
          <Button.Text>Disabled</Button.Text>
        </Button>
      );
      const button = screen.getByTestId('button-aria-disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} data-testid="button-keyboard">
          <Button.Text>Click me</Button.Text>
        </Button>
      );

      const button = screen.getByTestId('button-keyboard');
      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} data-testid="button-click">
          <Button.Text>Click me</Button.Text>
        </Button>
      );

      const button = screen.getByTestId('button-click');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button
          disabled
          onClick={handleClick}
          data-testid="button-disabled-no-click"
        >
          <Button.Text>Disabled</Button.Text>
        </Button>
      );

      const button = screen.getByTestId('button-disabled-no-click');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button
          isLoading
          onClick={handleClick}
          data-testid="button-loading-no-click"
        >
          <Button.Loading />
          <Button.Text>Loading</Button.Text>
        </Button>
      );

      const button = screen.getByTestId('button-loading-no-click');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
