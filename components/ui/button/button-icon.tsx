"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/ui";

/**
 * Button.Icon - Icon subcomponent
 * Use this for consistent icon styling and positioning
 * 
 * @example
 * ```tsx
 * <Button variant="primary">
 *   <Button.Icon icon={LogIn} position="left" />
 *   <Button.Text>Sign in</Button.Text>
 * </Button>
 * ```
 */
export interface ButtonIconProps {
  icon: LucideIcon;
  position?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ButtonIcon({ icon: Icon, position = "left", size = "md", className }: ButtonIconProps) {
  return (
    <Icon
      className={cn(
        styles.icon,
        styles.iconSizes[size],
        position === "left" && styles.iconLeft,
        position === "right" && styles.iconRight,
        className
      )}
      aria-hidden="true"
    />
  );
}

ButtonIcon.displayName = "Button.Icon";

const styles = {
  icon: "flex-shrink-0",
  iconSizes: {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  } as const,
  iconLeft: "order-first",
  iconRight: "order-last",
} as const;
