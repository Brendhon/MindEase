"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";
import { styles } from "./checkbox-styles";

/**
 * Checkbox.Description - Description text for checkbox
 * 
 * @example
 * ```tsx
 * <Checkbox checked={enabled} onChange={setEnabled}>
 *   <Checkbox.Label>Enable notifications</Checkbox.Label>
 *   <Checkbox.Description>Receive email notifications</Checkbox.Description>
 * </Checkbox>
 * ```
 */
export interface CheckboxDescriptionProps {
  /** Description content */
  children: ReactNode;
  
  /** Custom className */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function CheckboxDescription({
  children,
  className,
  "data-testid": testId,
}: CheckboxDescriptionProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm, className),
    [fontSizeClasses.sm, className]
  );

  return (
    <span className={descriptionClasses} data-testid={testId || "checkbox-description"}>
      {children}
    </span>
  );
}

CheckboxDescription.displayName = "Checkbox.Description";
