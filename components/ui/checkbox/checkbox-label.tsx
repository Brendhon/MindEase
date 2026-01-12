"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";
import { styles } from "./checkbox-styles";

/**
 * Checkbox.Label - Label text for checkbox
 * 
 * @example
 * ```tsx
 * <Checkbox checked={enabled} onChange={setEnabled}>
 *   <Checkbox.Label>Enable notifications</Checkbox.Label>
 * </Checkbox>
 * ```
 */
export interface CheckboxLabelProps {
  /** Label content */
  children: ReactNode;
  
  /** Whether checkbox is checked (for strikethrough styling) */
  checked?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Click handler (for making label clickable) */
  onClick?: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function CheckboxLabel({
  children,
  checked = false,
  className,
  onClick,
  "data-testid": testId,
}: CheckboxLabelProps) {
  const { fontSizeClasses } = useCognitiveSettings();

  const labelClasses = useMemo(
    () => cn(
      styles.label,
      fontSizeClasses.sm,
      checked && styles.labelChecked,
      className
    ),
    [fontSizeClasses.sm, checked, className]
  );

  return (
    <span
      className={labelClasses}
      onClick={onClick}
      data-testid={testId || "checkbox-label"}
    >
      {children}
    </span>
  );
}

CheckboxLabel.displayName = "Checkbox.Label";
