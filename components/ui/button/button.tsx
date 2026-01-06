"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { Button as HeadlessButton } from "@headlessui/react";
import { cn } from "@/utils/ui";
import { ButtonIcon } from "./button-icon";
import { ButtonText } from "./button-text";
import { ButtonLoading } from "./button-loading";

/**
 * Button Component - MindEase
 * Accessible, extensible button with cognitive accessibility features
 * 
 * Uses composition pattern exclusively - only accepts Button subcomponents:
 * - Button.Icon for icons
 * - Button.Text for text content
 * - Button.Loading for loading states
 * 
 * @example
 * ```tsx
 * // With text only
 * <Button variant="primary" size="md">
 *   <Button.Text>Click me</Button.Text>
 * </Button>
 * 
 * // With icon and text
 * <Button variant="primary">
 *   <Button.Icon icon={LogIn} position="left" />
 *   <Button.Text>Sign in</Button.Text>
 * </Button>
 * 
 * // With loading state
 * <Button variant="primary" isLoading>
 *   <Button.Loading />
 *   <Button.Text>Saving...</Button.Text>
 * </Button>
 * ```
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: ReactNode; // Only accepts Button subcomponents
}

const ButtonRoot = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <HeadlessButton
        ref={ref}
        disabled={isDisabled}
        className={cn(
          styles.base,
          styles.variants[variant],
          styles.sizes[size],
          isDisabled && styles.disabled,
          className
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <ButtonLoading size={size} />
        ) : (
          children
        )}
      </HeadlessButton>
    );
  }
);

ButtonRoot.displayName = "Button";

// Compose Button with subcomponents
export const Button = Object.assign(ButtonRoot, {
  Icon: ButtonIcon,
  Text: ButtonText,
  Loading: ButtonLoading,
});

const styles = {
  base: "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  variants: {
    primary: "bg-action-primary text-text-inverse hover:opacity-90 focus:ring-action-primary active:opacity-80",
    secondary: "bg-surface-secondary text-text-primary hover:bg-surface-tertiary focus:ring-action-primary active:bg-surface-tertiary",
    ghost: "bg-transparent text-text-primary hover:bg-surface-secondary focus:ring-action-primary active:bg-surface-secondary",
  } as const,
  sizes: {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-base gap-2",
    lg: "h-12 px-6 text-lg gap-2.5",
  } as const,
  disabled: "opacity-50 cursor-not-allowed pointer-events-none",
} as const;
