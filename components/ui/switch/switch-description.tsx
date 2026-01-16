"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { styles } from "./switch-styles";

/**
 * Switch.Description - Description subcomponent
 * 
 * @example
 * ```tsx
 * <Switch checked={enabled} onChange={setEnabled}>
 *   <Switch.Toggle />
 *   <Switch.Label>Enable notifications</Switch.Label>
 *   <Switch.Description>Receive email notifications</Switch.Description>
 * </Switch>
 * ```
 */
export interface SwitchDescriptionProps {
  /** Description text */
  children: string;
  
  /** HTML id attribute for accessibility */
  id?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function SwitchDescription({
  children,
  id,
  "data-testid": testId,
}: SwitchDescriptionProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <p
      id={id}
      className={descriptionClasses}
      data-testid={testId || "switch-description"}
    >
      {children}
    </p>
  );
}

SwitchDescription.displayName = "Switch.Description";
