import { ReactNode } from "react";

/**
 * Alert Component - MindEase
 * Accessible alert component for feedback messages
 */
export interface AlertProps {
  variant?: "info" | "warning" | "error" | "success";
  title?: string;
  children: ReactNode;
  "data-testid"?: string;
}

export function Alert({ variant = "info", title, children, "data-testid": dataTestId }: AlertProps) {
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
      data-testid={dataTestId || `alert-${variant}`}
    >
      {title && (
        <h3 className="font-semibold mb-2" data-testid={`${dataTestId || `alert-${variant}`}-title`}>{title}</h3>
      )}
      <div data-testid={`${dataTestId || `alert-${variant}`}-content`}>{children}</div>
    </div>
  );
}

