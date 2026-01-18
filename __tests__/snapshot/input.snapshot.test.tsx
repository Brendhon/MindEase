import { Input } from '@/components/form/input';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
  cognitiveSettingsContextMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses directly in this test file
// This ensures the mock is applied before the component imports it
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

// Mock useCognitiveSettingsContext
vi.mock('@/contexts/cognitive-settings', () => ({
  useCognitiveSettingsContext: () => cognitiveSettingsContextMocks.default(),
}));

/**
 * Snapshot tests for Input component
 *
 * These tests ensure that the component structure remains consistent.
 * Update snapshots when making intentional visual/structure changes.
 *
 * Run `npm run test:snapshot -- -u` to update snapshots after intentional changes.
 */
describe('Input Snapshot', () => {
  it('should match snapshot for basic input with label', () => {
    const { container } = render(
      <Input>
        <Input.Label htmlFor="email">Email</Input.Label>
        <Input.Field id="email" type="email" />
      </Input>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for input with different types', () => {
    const { container: text } = render(
      <Input>
        <Input.Label htmlFor="text">Text</Input.Label>
        <Input.Field id="text" type="text" />
      </Input>
    );
    expect(text.firstChild).toMatchSnapshot('input-text');

    const { container: password } = render(
      <Input>
        <Input.Label htmlFor="password">Password</Input.Label>
        <Input.Field id="password" type="password" />
      </Input>
    );
    expect(password.firstChild).toMatchSnapshot('input-password');

    const { container: number } = render(
      <Input>
        <Input.Label htmlFor="number">Number</Input.Label>
        <Input.Field id="number" type="number" />
      </Input>
    );
    expect(number.firstChild).toMatchSnapshot('input-number');
  });

  it('should match snapshot for textarea', () => {
    const { container } = render(
      <Input>
        <Input.Label htmlFor="description">Description</Input.Label>
        <Input.Field id="description" as="textarea" />
      </Input>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for input with error', () => {
    const { container } = render(
      <Input>
        <Input.Label htmlFor="email">Email</Input.Label>
        <Input.Field id="email" type="email" />
        <Input.Error>Please enter a valid email</Input.Error>
      </Input>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for disabled input', () => {
    const { container } = render(
      <Input>
        <Input.Label htmlFor="disabled">Disabled</Input.Label>
        <Input.Field id="disabled" type="text" disabled />
      </Input>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
