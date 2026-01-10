"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { ReactNode, useMemo } from "react";

/**
 * PageContent Component - MindEase
 * Standardized page content wrapper with cognitive accessibility features
 * 
 * This component provides a consistent structure for authenticated pages:
 * - Container with animation support
 * - Main content area with responsive spacing
 * - Automatic integration with cognitive settings
 * 
 * @example
 * ```tsx
 * <PageContent data-testid="my-page">
 *   <PageHeader titleKey="my_title" />
 *   <MyContent />
 * </PageContent>
 * ```
 */
export interface PageContentProps {
  /** Page content to render */
  children: ReactNode;

  /** Additional classes for the container */
  containerClassName?: string;

  /** Additional classes for the main element */
  mainClassName?: string;

  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * PageContent Styles - MindEase
 * Centralized styles for page content component
 */
export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
} as const;

export function PageContent({
  children,
  containerClassName,
  mainClassName,
  "data-testid": testId = "page-content",
}: PageContentProps) {
  const { spacingClasses, animationClasses } = useCognitiveSettings();

  // Generate main container classes with spacing preference
  const mainClasses = useMemo(
    () =>
      cn(
        styles.main,
        spacingClasses.padding,
        spacingClasses.gap,
        mainClassName
      ),
    [spacingClasses.padding, spacingClasses.gap, mainClassName]
  );

  const containerClasses = useMemo(
    () => cn(styles.container, animationClasses, containerClassName),
    [animationClasses, containerClassName]
  );

  return (
    <div
      className={containerClasses}
      data-testid={testId || "page-content-container"}
    >
      <main className={mainClasses} role="main" data-testid={`${testId}-main`}>
        {children}
      </main>
    </div>
  );
}

PageContent.displayName = "PageContent";
