"use client";

import { ReactNode, useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { styles } from "./card-styles";

/**
 * Card.Content - Content subcomponent
 * Use this for consistent content area styling with spacing preference
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Content>
 *     Content here
 *   </Card.Content>
 * </Card>
 * ```
 */
export interface CardContentProps {
  children: ReactNode;
  className?: string;
  role?: string;
  "data-testid"?: string;
}

export function CardContent({ children, className, role, "data-testid": testId }: CardContentProps) {
  const { spacingClasses } = useCognitiveSettings();

  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap, className),
    [spacingClasses.gap, className]
  );

  return (
    <div className={contentClasses} role={role} data-testid={testId}>
      {children}
    </div>
  );
}

CardContent.displayName = "Card.Content";
