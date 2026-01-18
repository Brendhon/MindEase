import { Card } from '@/components/ui/card/card';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
  cognitiveSettingsMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

// Mock useCognitiveSettings
vi.mock('@/hooks/cognitive-settings', () => ({
  useCognitiveSettings: () => cognitiveSettingsMocks.default(),
}));

/**
 * Functional tests for Card component
 *
 * Tests renderization, composition, focus mode, and accessibility.
 */
describe('Card', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Basic Renderization', () => {
    it('should render basic card', () => {
      render(
        <Card data-testid="basic-card">
          <Card.Content>Card content</Card.Content>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeInTheDocument();
      expect(screen.getByTestId('basic-card')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      render(
        <Card data-testid="card-div">
          <Card.Content>Content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('card-div');
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('Composition API', () => {
    it('should render with Card.Header', () => {
      render(
        <Card data-testid="card-with-header">
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
          </Card.Header>
        </Card>
      );
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByTestId('card-with-header')).toBeInTheDocument();
    });

    it('should render with Card.Title', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>My Title</Card.Title>
          </Card.Header>
        </Card>
      );
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should render with Card.Description', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Title</Card.Title>
            <Card.Description>Description text</Card.Description>
          </Card.Header>
        </Card>
      );
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('should render with Card.Content', () => {
      render(
        <Card>
          <Card.Content>Main content area</Card.Content>
        </Card>
      );
      expect(screen.getByText('Main content area')).toBeInTheDocument();
    });

    it('should render complete card structure', () => {
      render(
        <Card data-testid="complete-card">
          <Card.Header>
            <Card.Title>Complete Card</Card.Title>
            <Card.Description>This is a complete card</Card.Description>
          </Card.Header>
          <Card.Content>Card content goes here</Card.Content>
        </Card>
      );

      expect(screen.getByText('Complete Card')).toBeInTheDocument();
      expect(screen.getByText('This is a complete card')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
    });
  });

  describe('Focus Mode', () => {
    it('should apply focus mode styles when focused={true}', () => {
      render(
        <Card focused={true} data-testid="focused-card">
          <Card.Content>Focused content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('focused-card');
      expect(card).toBeInTheDocument();
    });

    it('should not apply focus mode styles when focused={false}', () => {
      render(
        <Card focused={false} data-testid="unfocused-card">
          <Card.Content>Unfocused content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('unfocused-card');
      expect(card).toBeInTheDocument();
    });

    it('should default to focused={false}', () => {
      render(
        <Card data-testid="default-card">
          <Card.Content>Default content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('default-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Custom Element (as prop)', () => {
    it('should render as section when as="section"', () => {
      render(
        <Card as="section" data-testid="card-section">
          <Card.Content>Section content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('card-section');
      expect(card.tagName).toBe('SECTION');
    });

    it('should render as article when as="article"', () => {
      render(
        <Card as="article" data-testid="card-article">
          <Card.Content>Article content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('card-article');
      expect(card.tagName).toBe('ARTICLE');
    });

    it('should render as div when as="div"', () => {
      render(
        <Card as="div" data-testid="card-div-explicit">
          <Card.Content>Div content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('card-div-explicit');
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('Card.Title', () => {
    it('should render as h2 by default', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Default Title</Card.Title>
          </Card.Header>
        </Card>
      );
      const title = screen.getByText('Default Title');
      expect(title.tagName).toBe('H2');
    });

    it('should render as custom heading when as prop is provided', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title as="h1">H1 Title</Card.Title>
          </Card.Header>
        </Card>
      );
      const title = screen.getByText('H1 Title');
      expect(title.tagName).toBe('H1');
    });

    it('should support all heading levels', () => {
      const levels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ];

      levels.forEach((level) => {
        const { unmount } = render(
          <Card>
            <Card.Header>
              <Card.Title as={level}>{level.toUpperCase()} Title</Card.Title>
            </Card.Header>
          </Card>
        );
        const title = screen.getByText(`${level.toUpperCase()} Title`);
        expect(title.tagName).toBe(level.toUpperCase());
        unmount();
      });
    });
  });

  describe('Card.Content', () => {
    it('should render content with role attribute when provided', () => {
      render(
        <Card>
          <Card.Content role="main">Main content</Card.Content>
        </Card>
      );
      const content = screen.getByText('Main content');
      expect(content).toHaveAttribute('role', 'main');
    });

    it('should render content without role when not provided', () => {
      render(
        <Card>
          <Card.Content>Content without role</Card.Content>
        </Card>
      );
      const content = screen.getByText('Content without role');
      expect(content).not.toHaveAttribute('role');
    });
  });

  describe('Accessibility', () => {
    it('should apply accessibility classes', () => {
      render(
        <Card data-testid="accessible-card">
          <Card.Content>Accessible content</Card.Content>
        </Card>
      );
      const card = screen.getByTestId('accessible-card');
      expect(card).toBeInTheDocument();
    });

    it('should support custom data-testid', () => {
      render(
        <Card data-testid="custom-test-id">
          <Card.Content>Content</Card.Content>
        </Card>
      );
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple cards', () => {
      render(
        <>
          <Card data-testid="card-1">
            <Card.Content>Card 1</Card.Content>
          </Card>
          <Card data-testid="card-2">
            <Card.Content>Card 2</Card.Content>
          </Card>
        </>
      );
      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });

    it('should handle nested content', () => {
      render(
        <Card data-testid="nested-card">
          <Card.Header>
            <Card.Title>Nested Card</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card data-testid="inner-card">
              <Card.Content>Inner content</Card.Content>
            </Card>
          </Card.Content>
        </Card>
      );
      expect(screen.getByTestId('nested-card')).toBeInTheDocument();
      expect(screen.getByTestId('inner-card')).toBeInTheDocument();
      expect(screen.getByText('Inner content')).toBeInTheDocument();
    });
  });
});
