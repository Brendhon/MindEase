"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { LabelHTMLAttributes, ReactNode, useMemo } from "react";
import { styles } from "./select-styles";

/**
 * Select.Label - Label subcomponent
 * Use this for consistent label styling within selects
 * 
 * @example
 * ```tsx
 * <Select>
 *   <Select.Label htmlFor="country">Country</Select.Label>
 *   <Select.Field id="country">
 *     <option value="">Select a country</option>
 *     <option value="br">Brazil</option>
 *   </Select.Field>
 * </Select>
 * ```
 */
export interface SelectLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function SelectLabel({ children, className, ...props }: SelectLabelProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  // Font size automatically updates when user preferences change
  const { fontSizeClasses } = useAccessibilityClasses();

  // Get fontSize class (use sm for labels)
  const fontSizeClass = useMemo(
    () => fontSizeClasses.sm,
    [fontSizeClasses.sm]
  );

  return (
    <label
      className={cn(styles.label, fontSizeClass, className)} // Dynamically updates based on settings.fontSize
      {...props}
    >
      {children}
    </label>
  );
}

SelectLabel.displayName = "Select.Label";
