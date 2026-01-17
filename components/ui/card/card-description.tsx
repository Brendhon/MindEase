"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { BaseComponentProps } from "@/models/base";
import { getTextContrastClasses } from "@/utils/accessibility";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";
import { styles } from "./card-styles";

/**
 * Card.Description - Description subcomponent
 * Use this for consistent description styling with fontSize preference
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description text</Card.Description>
 *   </Card.Header>
 * </Card>
 * ```
 */
export interface CardDescriptionProps extends BaseComponentProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className, "data-testid": testId }: CardDescriptionProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();

  const textContrastClasses = useMemo(
    () => getTextContrastClasses(settings.contrast, "secondary"),
    [settings.contrast]
  );

  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm, textContrastClasses, className),
    [fontSizeClasses.sm, textContrastClasses, className]
  );

  return (
    <p className={descriptionClasses} data-testid={testId}>
      {children}
    </p>
  );
}

CardDescription.displayName = "Card.Description";
