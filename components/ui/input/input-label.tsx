"use client";

import { ReactNode, LabelHTMLAttributes } from "react";
import { cn } from "@/utils/ui";

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
  return (
    <label
      className={cn(styles.label, className)}
      {...props}
    >
      {children}
    </label>
  );
}

InputLabel.displayName = "Input.Label";

const styles = {
  label: "text-sm font-medium text-text-primary",
} as const;

