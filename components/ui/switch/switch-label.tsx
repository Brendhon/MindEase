"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { styles } from "./switch-styles";

/**
 * Switch.Label - Label subcomponent
 * 
 * @example
 * ```tsx
 * <Switch checked={enabled} onChange={setEnabled}>
 *   <Switch.Toggle />
 *   <Switch.Label>Enable notifications</Switch.Label>
 * </Switch>
 * ```
 */
export interface SwitchLabelProps {
  /** Label text */
  children: string;
  
  /** Click handler (optional, defaults to toggle switch) */
  onClick?: () => void;
  
  /** Disable the switch */
  disabled?: boolean;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function SwitchLabel({
  children,
  onClick,
  disabled = false,
  "data-testid": testId,
}: SwitchLabelProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  const labelClasses = useMemo(
    () => cn(styles.label, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <label
      className={labelClasses}
      onClick={onClick}
      data-testid={testId || "switch-label"}
    >
      {children}
    </label>
  );
}

SwitchLabel.displayName = "Switch.Label";
