"use client";

import { ReactNode, useMemo } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
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
  const { fontSizeClasses } = useCognitiveSettings();

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

