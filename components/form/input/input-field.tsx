"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useMemo } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles, getContrastClasses } from "./input-styles";

/**
 * Input.Field - Input field subcomponent
 * Use this for the actual input or textarea element
 * 
 * @example
 * ```tsx
 * <Input>
 *   <Input.Label htmlFor="email">Email</Input.Label>
 *   <Input.Field id="email" type="email" />
 * </Input>
 * ```
 */
export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, "type"> {
  type?: "text" | "email" | "password" | "number" | "textarea";
  as?: "input" | "textarea";
}

const InputFieldRoot = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ className = "", type = "text", as, ...props }, ref) => {
    const isTextarea = as === "textarea" || type === "textarea";
    const Component = isTextarea ? "textarea" : "input";
    const inputType = isTextarea ? undefined : type;
    const isDisabled = props.disabled;

    // Use cognitive settings hook for automatic accessibility class generation
    // These classes automatically update when user preferences change
    const { 
      settings, 
      fontSizeClasses, // Recalculates when settings.fontSize changes
      spacingClasses, // Recalculates when settings.spacing changes
      animationClasses, // Recalculates when settings.animations changes
    } = useCognitiveSettings();

    // Generate contrast classes with input-specific logic
    const contrastClasses = useMemo(
      () => getContrastClasses(settings.contrast),
      [settings.contrast]
    );

    // Get fontSize class (use base for inputs)
    const fontSizeClass = fontSizeClasses.base;

    // Get horizontal padding from spacing preference (convert p-X to px-X)
    const paddingClass = useMemo(() => {
      const paddingValue = spacingClasses.padding.replace('p-', '');
      return `px-${paddingValue}`;
    }, [spacingClasses.padding]);

    return (
      <Component
        ref={ref as any}
        type={inputType}
        className={cn(
          styles.field.base,
          isTextarea ? styles.field.textarea : styles.field.input,
          fontSizeClass, // Dynamically updates based on settings.fontSize
          paddingClass, // Dynamically updates based on settings.spacing (horizontal padding)
          animationClasses, // Dynamically updates based on settings.animations
          contrastClasses.base, // Contrast border
          contrastClasses.focus, // High contrast focus styles
          isDisabled && styles.field.disabled,
          className
        )}
        {...(props as InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }
);

InputFieldRoot.displayName = "Input.Field";

export const InputField = InputFieldRoot;

