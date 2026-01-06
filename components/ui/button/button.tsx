import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Button Component - MindEase
 * Accessible button with cognitive accessibility features
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantStyles = {
      primary: "bg-action-primary text-text-inverse hover:opacity-90 focus:ring-action-primary",
      secondary: "bg-surface-secondary text-text-primary hover:bg-surface-tertiary focus:ring-action-primary",
      ghost: "bg-transparent text-text-primary hover:bg-surface-secondary focus:ring-action-primary",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

