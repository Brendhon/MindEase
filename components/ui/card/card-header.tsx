"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { getBorderContrastClasses } from "@/utils/accessibility/tailwind-classes";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";
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
  const { settings } = useCognitiveSettings();
  const { spacingClasses } = useAccessibilityClasses();
  
  const borderClasses = useMemo(
    () => getBorderContrastClasses(settings.contrast, "subtle"),
    [settings.contrast]
  );
  
  const headerClasses = useMemo(
    () => cn(styles.header, spacingClasses.gap, borderClasses, className),
    [spacingClasses.gap, borderClasses, className]
  );

  return (
    <div className={headerClasses} data-testid={testId}>
      {children}
    </div>
  );
}

CardHeader.displayName = "Card.Header";
