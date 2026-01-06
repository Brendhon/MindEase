import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

/**
 * Input Component - MindEase
 * Accessible input with cognitive accessibility features
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: "text" | "email" | "password" | "number" | "textarea";
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className = "", label, error, id, type = "text", ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isTextarea = type === "textarea";

    const baseStyles = "px-4 rounded-md border border-border-subtle bg-surface-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent";
    const inputStyles = isTextarea ? `min-h-24 py-2 ${baseStyles}` : `h-10 ${baseStyles}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        {isTextarea ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={inputId}
            className={`${inputStyles} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            id={inputId}
            type={type}
            className={`${inputStyles} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-feedback-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

