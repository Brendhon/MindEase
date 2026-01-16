"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { Button as HeadlessButton } from "@headlessui/react";
import { ButtonHTMLAttributes, ReactNode, forwardRef, useMemo } from "react";
import { ButtonIcon } from "./button-icon";
import { ButtonLoading } from "./button-loading";
import { getContrastClasses, getSizeClasses, styles } from "./button-styles";
import { ButtonText } from "./button-text";

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
  variant?: "primary" | "secondary" | "ghost" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: ReactNode; // Only accepts Button subcomponents
  "data-testid"?: string;
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
    
    // Use accessibility classes hook for optimized class generation
    // Only re-renders when relevant settings change
    const { 
      fontSizeClasses, // Recalculates only when settings.fontSize changes
      animationClasses, // Recalculates only when settings.animations changes
      spacingClasses, // Recalculates only when settings.spacing changes
    } = useAccessibilityClasses();
    
    // Get contrast setting directly from (only re-renders when contrast changes)
    const { settings } = useCognitiveSettings();

    // Generate size classes (height, padding, gap)
    const sizeClasses = useMemo(
      () => getSizeClasses(size),
      [size]
    );

    // Generate contrast classes with button-specific logic (variant-based borders)
    const contrastClasses = useMemo(
      () => getContrastClasses(settings.contrast, variant),
      [settings.contrast, variant]
    );

    // Get fontSize class based on size prop and user preference
    // Map button size to fontSize context: sm -> sm, md -> base, lg -> lg
    const fontSizeClass = useMemo(() => {
      const sizeToFontContext: Record<typeof size, "sm" | "base" | "lg"> = {
        sm: "sm",
        md: "base",
        lg: "lg",
      };
      return fontSizeClasses[sizeToFontContext[size]];
    }, [fontSizeClasses, size]);

    return (
      <HeadlessButton
        ref={ref}
        disabled={isDisabled}
        className={cn(
          styles.base,
          styles.variants[variant],
          sizeClasses,
          fontSizeClass, // Dynamically updates based on settings.fontSize
          spacingClasses.gap, // Dynamically updates based on settings.spacing (internal spacing between icon/text)
          animationClasses, // Dynamically updates based on settings.animations
          contrastClasses,
          isDisabled && styles.disabled,
          className
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        data-testid={props["data-testid"]}
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
