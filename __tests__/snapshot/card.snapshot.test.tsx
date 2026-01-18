import { Card } from '@/components/ui/card/card';
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
 * Snapshot tests for Card component
 *
 * These tests ensure that the component structure remains consistent.
 * Update snapshots when making intentional visual/structure changes.
 *
 * Run `npm run test:snapshot -- -u` to update snapshots after intentional changes.
 */
describe('Card Snapshot', () => {
  it('should match snapshot for basic card with content', () => {
    const { container } = render(
      <Card data-testid="card-basic">
        <Card.Content>Card content</Card.Content>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for card with header and title', () => {
    const { container } = render(
      <Card data-testid="card-header">
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
        </Card.Header>
        <Card.Content>Card content</Card.Content>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for card with all subcomponents', () => {
    const { container } = render(
      <Card data-testid="card-complete">
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card description</Card.Description>
        </Card.Header>
        <Card.Content>Card content</Card.Content>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for focused card', () => {
    const { container } = render(
      <Card focused data-testid="card-focused">
        <Card.Content>Focused card content</Card.Content>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for card with different HTML element', () => {
    const { container: section } = render(
      <Card as="section" data-testid="card-section">
        <Card.Content>Section card</Card.Content>
      </Card>
    );
    expect(section.firstChild).toMatchSnapshot('card-section');

    const { container: article } = render(
      <Card as="article" data-testid="card-article">
        <Card.Content>Article card</Card.Content>
      </Card>
    );
    expect(article.firstChild).toMatchSnapshot('card-article');
  });
});
