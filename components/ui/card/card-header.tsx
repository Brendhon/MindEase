"use client";

import { ReactNode, useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { styles } from "./card-styles";

/**
 * Card.Header - Header subcomponent
 * Use this for consistent header styling within cards
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *   </Card.Header>
 * </Card>
 * ```
 */
export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function CardHeader({ children, className, "data-testid": testId }: CardHeaderProps) {
  const { spacingClasses } = useCognitiveSettings();
  
  const headerClasses = useMemo(
    () => cn(styles.header, spacingClasses.gap, className),
    [spacingClasses.gap, className]
  );

  return (
    <div className={headerClasses} data-testid={testId}>
      {children}
    </div>
  );
}

CardHeader.displayName = "Card.Header";
