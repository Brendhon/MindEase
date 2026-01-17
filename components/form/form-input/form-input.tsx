"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { useId, useMemo } from "react";
import { Controller, ControllerProps, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { InputRoot } from "../input/input";
import { styles } from "./form-input-styles";

/**
 * FormInput - Integrated Input with react-hook-form and zod
 * 
 * Automatically connects to form context, displays validation errors,
 * and handles accessibility attributes.
 * 
 * @example
 * ```tsx
 * // Inside a FormProvider
 * <FormInput
 *   name="email"
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 * />
 * 
 * // Textarea
 * <FormInput
 *   name="description"
 *   label="Description"
 *   as="textarea"
 *   placeholder="Tell us more..."
 * />
 * 
 * // With custom validation
 * <FormInput
 *   name="username"
 *   label="Username"
 *   rules={{ minLength: 3 }}
 * />
 * ```
 */
export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  /** Field name (must match zod schema key) */
  name: TName;
  
  /** Label text */
  label: string;
  
  /** Input type */
  type?: "text" | "email" | "password" | "number" | "textarea";
  
  /** Component type */
  as?: "input" | "textarea";
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Disable the input */
  disabled?: boolean;
  
  /** Additional validation rules (optional, zod handles most) */
  rules?: ControllerProps<TFieldValues, TName>["rules"];
  
  /** Custom className for container */
  className?: string;
  
  /** Custom className for input field */
  inputClassName?: string;
  
  /** Whether the field is required (adds * to label) */
  required?: boolean;
  
  /** Helper text to display below the input */
  helperText?: string;

  /** Number of rows for textarea (only applies when as="textarea") */
  rows?: number;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  type = "text",
  as,
  placeholder,
  disabled,
  rules,
  className,
  inputClassName,
  required,
  helperText,
  rows,
}: FormInputProps<TFieldValues, TName>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  
  // Generate stable IDs for accessibility
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const errorId = `${name}-error-${generatedId}`;
  const helperId = helperText ? `${name}-helper-${generatedId}` : undefined;
  
  // Get error message from form state
  const fieldError = errors[name];
  const errorMessage = fieldError?.message as string | undefined;
  
  // Use cognitive settings hook for automatic accessibility class generation
  // Font size automatically updates when user preferences change
  const { fontSizeClasses } = useAccessibilityClasses();

  // Get fontSize class for helper text (use sm)
  const helperTextFontSize = useMemo(
    () => fontSizeClasses.sm,
    [fontSizeClasses.sm]
  );
  
  // Build aria-describedby
  const ariaDescribedBy = [
    errorMessage ? errorId : null,
    helperId,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <InputRoot className={className} data-testid={`form-input-${name}`}>
          <InputRoot.Label htmlFor={inputId}>
            {label}
            {required && <span className={styles.requiredIndicator} aria-label="required">*</span>}
          </InputRoot.Label>
          
          <InputRoot.Field
            {...field}
            id={inputId}
            type={type}
            as={as}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            aria-invalid={!!errorMessage}
            aria-describedby={ariaDescribedBy}
            className={cn(
              errorMessage && styles.fieldError,
              inputClassName
            )}
            data-testid={`form-input-field-${name}`}
          />
          
          {helperText && !errorMessage && (
            <p
              id={helperId}
              className={cn(styles.helperText, helperTextFontSize)} // Dynamically updates based on settings.fontSize
              data-testid={`form-input-helper-${name}`}
            >
              {helperText}
            </p>
          )}
          
          {errorMessage && (
            <InputRoot.Error id={errorId} data-testid={`form-input-error-${name}`}>
              {errorMessage}
            </InputRoot.Error>
          )}
        </InputRoot>
      )}
    />
  );
}

FormInput.displayName = "FormInput";

