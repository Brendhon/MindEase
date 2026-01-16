"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";
import { styles } from "./input-styles";

/**
 * Input.Error - Error message subcomponent
 * Use this for displaying error messages
 * 
 * @example
 * ```tsx
 * <Input>
 *   <Input.Label htmlFor="email">Email</Input.Label>
 *   <Input.Field id="email" type="email" />
 *   <Input.Error>Please enter a valid email</Input.Error>
 * </Input>
 * ```
 */
export interface InputErrorProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function InputError({ children, id, className }: InputErrorProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  // Font size automatically updates when user preferences change
  const { fontSizeClasses } = useAccessibilityClasses();

  // Get fontSize class (use sm for error messages)
  const fontSizeClass = useMemo(
    () => fontSizeClasses.sm,
    [fontSizeClasses.sm]
  );

  return (
    <p
      id={id}
      className={cn(styles.error, fontSizeClass, className)} // Dynamically updates based on settings.fontSize
      role="alert"
    >
      {children}
    </p>
  );
}

InputError.displayName = "Input.Error";

