"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * PageHeader Component - MindEase
 * Reusable page header with title and description
 * Automatically applies accessibility settings (fontSize)
 * 
 * Uses standardized sizes:
 * - Title: 2xl (responsive to user fontSize preference)
 * - Description: base (responsive to user fontSize preference)
 * 
 * @example
 * ```tsx
 * // Using text keys (recommended)
 * <PageHeader
 *   titleKey="dashboard_title"
 *   descriptionKey="dashboard_description"
 * />
 * 
 * // Using direct text
 * <PageHeader
 *   title="My Page"
 *   description="Page description"
 * />
 * 
 * // Custom heading level (for nested sections)
 * <PageHeader
 *   titleKey="profile_title"
 *   descriptionKey="profile_description"
 * />
 * ```
 */
export interface PageHeaderProps {
  /** Title text key for accessibility text system (preferred) */
  titleKey: AccessibilityTextKey;

  /** Description text key for accessibility text system (preferred) */
  descriptionKey: AccessibilityTextKey;

  /** Custom className */
  className?: string;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function PageHeader({
  titleKey,
  descriptionKey,
  className,
  "data-testid": testId,
}: PageHeaderProps) {
  const { getText } = useTextDetail();
  const { fontSizeClasses } = useAccessibilityClasses();

  // Generate title classes with standardized 2xl size
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses["2xl"]),
    [fontSizeClasses]
  );

  // Generate description classes with standardized base size
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.base),
    [fontSizeClasses]
  );

  // Generate header classes
  const headerClasses = useMemo(
    () => cn(styles.header, className),
    [className]
  );

  // Generate test IDs
  const h1TestId = useMemo(() => testId ? `${testId}-title` : "page-header-title", [testId]);
  const pTestId = useMemo(() => testId ? `${testId}-description` : "page-header-description", [testId]);

  return (
    <header className={headerClasses} data-testid={testId || "page-header"}>
      <h1 className={titleClasses} data-testid={h1TestId}>
        {getText(titleKey)}
      </h1>
      <p className={descriptionClasses} data-testid={pTestId}>
        {getText(descriptionKey)}
      </p>
    </header>
  );
}

PageHeader.displayName = "PageHeader";

/**
 * PageHeader Styles - MindEase
 * Centralized styles for page header component
 */

export const styles = {
  header: "flex flex-col",
  title: "font-semibold text-text-primary leading-tight",
  description: "text-text-secondary leading-relaxed mt-2",
} as const;
