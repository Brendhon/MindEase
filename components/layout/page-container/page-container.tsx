import { ReactNode } from "react";

/**
 * Page Container Component - MindEase
 * Consistent page container with cognitive accessibility features
 */
export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function PageContainer({ children, className = "", "data-testid": dataTestId = "page-container" }: PageContainerProps) {
  return (
    <div className={`max-w-4xl mx-auto p-8 ${className}`} data-testid={dataTestId}>
      {children}
    </div>
  );
}

