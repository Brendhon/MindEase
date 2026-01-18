"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/ui";
import { styles } from "./button-styles";

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
        styles.icon.base,
        styles.icon.sizes[size],
        position === "left" && styles.icon.left,
        position === "right" && styles.icon.right,
        className
      )}
      aria-hidden="true"
    />
  );
}

ButtonIcon.displayName = "Button.Icon";
