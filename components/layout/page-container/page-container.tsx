import { ReactNode } from "react";

/**
 * Page Container Component - MindEase
 * Consistent page container with cognitive accessibility features
 */
export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`max-w-4xl mx-auto p-8 ${className}`}>
      {children}
    </div>
  );
}

