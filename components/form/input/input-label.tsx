"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { LabelHTMLAttributes, ReactNode, useMemo } from "react";
import { styles } from "./input-styles";

/**
 * Input.Label - Label subcomponent
 * Use this for consistent label styling within inputs
 * 
 * @example
 * ```tsx
 * <Input>
 *   <Input.Label htmlFor="email">Email</Input.Label>
 *   <Input.Field id="email" type="email" />
 * </Input>
 * ```
 */
export interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function InputLabel({ children, className, ...props }: InputLabelProps) {
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

InputLabel.displayName = "Input.Label";

