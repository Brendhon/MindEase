"use client";

import { ReactNode, useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { getBorderContrastClasses, getFocusModeClasses } from "@/utils/accessibility/tailwind-classes";
import { CardHeader } from "./card-header";
import { CardTitle } from "./card-title";
import { CardDescription } from "./card-description";
import { CardContent } from "./card-content";
import { styles } from "./card-styles";

/**
 * Card Component - MindEase
 * Base card component with automatic accessibility settings application
 * 
 * Uses composition pattern - accepts Card subcomponents:
 * - Card.Header for header section
 * - Card.Title for title
 * - Card.Description for description
 * - Card.Content for main content
 * 
 * This component automatically applies:
 * - Spacing preferences (padding, gap)
 * - Contrast settings
 * - Animation preferences
 * - Focus mode styles (only when focused prop is true)
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description</Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     Content here
 *   </Card.Content>
 * </Card>
 * ```
 * 
 * @example
 * ```tsx
 * <Card focused={isActive}>
 *   <Card.Content>Focused card content</Card.Content>
 * </Card>
 * ```
 */
export interface CardProps {
  /** Card content */
  children: ReactNode;
  
  /** Custom className to extend base styles */
  className?: string;
  
  /** HTML element to render (default: div) */
  as?: "div" | "section" | "article";
  
  /** Whether this card is currently focused (applies focus mode styles) */
  focused?: boolean;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

const CardRoot = function Card({
  children,
  className,
  as: Component = "div",
  focused = false,
  "data-testid": testId,
}: CardProps) {
  const { spacingClasses, contrastClasses, animationClasses, settings } = useCognitiveSettings();

  const borderClasses = useMemo(
    () => getBorderContrastClasses(settings.contrast, "subtle"),
    [settings.contrast]
  );

  // Only apply focus mode classes when this specific card is focused
  const focusModeClasses = useMemo(
    () => getFocusModeClasses(focused),
    [focused]
  );

  const cardClasses = useMemo(
    () => cn(
      styles.base,
      spacingClasses.padding,
      spacingClasses.gap,
      contrastClasses,
      borderClasses,
      animationClasses,
      focusModeClasses,
      className
    ),
    [spacingClasses.padding, spacingClasses.gap, contrastClasses, borderClasses, animationClasses, focusModeClasses, className]
  );

  return (
    <Component className={cardClasses} data-testid={testId}>
      {children}
    </Component>
  );
};

CardRoot.displayName = "Card";

// Compose Card with subcomponents
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
});
