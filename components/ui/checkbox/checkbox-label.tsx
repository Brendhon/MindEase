"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";
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
export interface CheckboxLabelProps extends BaseComponentProps {
  /** Label content */
  children: ReactNode;
  
  /** Whether checkbox is checked (for strikethrough styling) */
  checked?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Click handler (for making label clickable) */
  onClick?: () => void;
}

export function CheckboxLabel({
  children,
  checked = false,
  className,
  onClick,
  "data-testid": testId,
}: CheckboxLabelProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

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
      title={children?.toString() || ""}
      data-testid={testId || "checkbox-label"}
    >
      {children}
    </span>
  );
}

CheckboxLabel.displayName = "Checkbox.Label";
