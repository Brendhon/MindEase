"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/ui";

/**
 * Button.Text - Text subcomponent
 * Use this for consistent text styling within buttons
 * 
 * @example
 * ```tsx
 * <Button variant="primary">
 *   <Button.Text>Click me</Button.Text>
 * </Button>
 * ```
 */
export interface ButtonTextProps {
  children: ReactNode;
  className?: string;
}

export function ButtonText({ children, className }: ButtonTextProps) {
  return (
    <span className={cn(styles.text, className)}>
      {children}
    </span>
  );
}

ButtonText.displayName = "Button.Text";

const styles = {
  text: "flex items-center",
} as const;
