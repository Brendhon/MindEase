"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/ui";

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

    return (
      <Component
        ref={ref as any}
        type={inputType}
        className={cn(
          styles.base,
          isTextarea ? styles.textarea : styles.input,
          isDisabled && styles.disabled,
          className
        )}
        {...(props as InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }
);

InputFieldRoot.displayName = "Input.Field";

export const InputField = InputFieldRoot;

const styles = {
  base: "px-4 rounded-md border border-border-subtle bg-surface-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent transition-colors duration-150",
  input: "h-10",
  textarea: "min-h-24 py-2 resize-y",
  disabled: "opacity-50 cursor-not-allowed pointer-events-none",
} as const;

