import { ReactNode } from "react";

/**
 * Alert Banner Component - MindEase
 * Accessible alert banner for important messages
 */
export interface AlertBannerProps {
  variant?: "info" | "warning" | "error" | "success";
  children: ReactNode;
}

export function AlertBanner({ variant = "info", children }: AlertBannerProps) {
  const variantStyles = {
    info: "bg-feedback-info/10 border-feedback-info text-feedback-info",
    warning: "bg-feedback-warning/10 border-feedback-warning text-feedback-warning",
    error: "bg-feedback-error/10 border-feedback-error text-feedback-error",
    success: "bg-feedback-success/10 border-feedback-success text-feedback-success",
  };

  return (
    <div
      role="alert"
      className={`p-4 rounded-md border ${variantStyles[variant]}`}
    >
      {children}
    </div>
  );
}

