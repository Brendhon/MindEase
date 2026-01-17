"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { BaseComponentProps } from "@/models/base";
import { getTextContrastClasses } from "@/utils/accessibility/tailwind-classes";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";
import { styles } from "./card-styles";

/**
 * Card.Title - Title subcomponent
 * Use this for consistent title styling with fontSize preference
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>My Title</Card.Title>
 *   </Card.Header>
 * </Card>
 * ```
 */
export interface CardTitleProps extends BaseComponentProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export function CardTitle({ children, as: Component = "h2", className, "data-testid": testId }: CardTitleProps) {
  const { settings } = useCognitiveSettings();
  const { fontSizeClasses } = useAccessibilityClasses();

  const textContrastClasses = useMemo(
    () => getTextContrastClasses(settings.contrast, "primary"),
    [settings.contrast]
  );

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.lg, textContrastClasses, className),
    [fontSizeClasses.lg, textContrastClasses, className]
  );

  return (
    <Component className={titleClasses} data-testid={testId}>
      {children}
    </Component>
  );
}

CardTitle.displayName = "Card.Title";
