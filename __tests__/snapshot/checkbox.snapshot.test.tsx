import { Checkbox } from '@/components/ui/checkbox/checkbox';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses directly in this test file
// This ensures the mock is applied before the component imports it
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

/**
 * Snapshot tests for Checkbox component
 *
 * These tests ensure that the component structure remains consistent.
 * Update snapshots when making intentional visual/structure changes.
 *
 * Run `npm run test:snapshot -- -u` to update snapshots after intentional changes.
 */
describe('Checkbox Snapshot', () => {
  it('should match snapshot for unchecked checkbox', () => {
    const { container } = render(
      <Checkbox
        checked={false}
        onChange={vi.fn()}
        data-testid="checkbox-unchecked"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for checked checkbox', () => {
    const { container } = render(
      <Checkbox
        checked={true}
        onChange={vi.fn()}
        data-testid="checkbox-checked"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for checkbox with label', () => {
    const { container } = render(
      <Checkbox checked={false} onChange={vi.fn()} data-testid="checkbox-label">
        <Checkbox.Label>Checkbox label</Checkbox.Label>
      </Checkbox>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for disabled checkbox', () => {
    const { container } = render(
      <Checkbox
        checked={false}
        onChange={vi.fn()}
        disabled
        data-testid="checkbox-disabled"
      >
        <Checkbox.Label>Disabled checkbox</Checkbox.Label>
      </Checkbox>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for checked checkbox with label', () => {
    const { container } = render(
      <Checkbox
        checked={true}
        onChange={vi.fn()}
        data-testid="checkbox-checked-label"
      >
        <Checkbox.Label checked={true}>Checked label</Checkbox.Label>
      </Checkbox>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
