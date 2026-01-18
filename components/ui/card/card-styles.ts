/**
 * Card Styles - MindEase
 * Centralized styles for card component
 *
 * Note: Contrast classes are applied dynamically via useCognitiveSettings hook
 * to ensure WCAG 2.1 compliance (minimum 4.5:1 for normal text, 3:1 for large text)
 */

export const styles = {
  base: 'flex flex-col bg-surface-primary border rounded-lg',
  header: 'flex flex-col border-b',
  title: 'font-semibold',
  description: 'mt-1',
  content: 'flex flex-col',
} as const;
