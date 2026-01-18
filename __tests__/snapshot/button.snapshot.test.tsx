import { Button } from '@/components/ui/button/button';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
  cognitiveSettingsMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses directly in this test file
// This ensures the mock is applied before the component imports it
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

// Mock useCognitiveSettings
vi.mock('@/hooks/cognitive-settings', () => ({
  useCognitiveSettings: () => cognitiveSettingsMocks.default(),
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
