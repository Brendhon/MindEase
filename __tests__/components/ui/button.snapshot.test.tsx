import { Button } from '@/components/ui/button/button';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
 * Snapshot tests for Button component
 * 
 * These tests ensure that the component structure remains consistent.
 * Update snapshots when making intentional visual/structure changes.
 * 
 * Run `npm run test:snapshot -- -u` to update snapshots after intentional changes.
 */
describe('Button Snapshot', () => {
  it('should match snapshot for basic button with text', () => {
    const { container } = render(
      <Button data-testid="button-basic">
        <Button.Text>Click me</Button.Text>
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for primary variant', () => {
    const { container } = render(
      <Button variant="primary" data-testid="button-primary">
        <Button.Text>Primary Button</Button.Text>
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for secondary variant', () => {
    const { container } = render(
      <Button variant="secondary" data-testid="button-secondary">
        <Button.Text>Secondary Button</Button.Text>
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for disabled button', () => {
    const { container } = render(
      <Button disabled data-testid="button-disabled">
        <Button.Text>Disabled Button</Button.Text>
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for loading button', () => {
    const { container } = render(
      <Button isLoading data-testid="button-loading">
        <Button.Loading />
        <Button.Text>Saving...</Button.Text>
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for different sizes', () => {
    const { container: small } = render(
      <Button size="sm" data-testid="button-small">
        <Button.Text>Small</Button.Text>
      </Button>
    );
    expect(small.firstChild).toMatchSnapshot('button-small');

    const { container: medium } = render(
      <Button size="md" data-testid="button-medium">
        <Button.Text>Medium</Button.Text>
      </Button>
    );
    expect(medium.firstChild).toMatchSnapshot('button-medium');

    const { container: large } = render(
      <Button size="lg" data-testid="button-large">
        <Button.Text>Large</Button.Text>
      </Button>
    );
    expect(large.firstChild).toMatchSnapshot('button-large');
  });
});
