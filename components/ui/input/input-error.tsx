"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/ui";

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
  return (
    <p
      id={id}
      className={cn(styles.error, className)}
      role="alert"
    >
      {children}
    </p>
  );
}

InputError.displayName = "Input.Error";

const styles = {
  error: "text-sm text-feedback-error",
} as const;

