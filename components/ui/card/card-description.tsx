"use client";

import { ReactNode, useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
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
export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function CardDescription({ children, className, "data-testid": testId }: CardDescriptionProps) {
  const { fontSizeClasses } = useCognitiveSettings();

  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm, className),
    [fontSizeClasses.sm, className]
  );

  return (
    <p className={descriptionClasses} data-testid={testId}>
      {children}
    </p>
  );
}

CardDescription.displayName = "Card.Description";
