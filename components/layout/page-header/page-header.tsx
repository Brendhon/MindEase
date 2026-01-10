"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";

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
  titleKey?: AccessibilityTextKey;
  
  /** Description text key for accessibility text system (preferred) */
  descriptionKey?: AccessibilityTextKey;
  
  /** Direct title text (alternative to titleKey) */
  title?: string;
  
  /** Direct description text (alternative to descriptionKey) */
  description?: string;
  
  /** Custom className */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function PageHeader({
  titleKey,
  descriptionKey,
  title,
  description,
  className,
  "data-testid": testId,
}: PageHeaderProps) {
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  // Get title text - prefer textKey over direct text
  const titleText = useMemo(() => {
    if (titleKey) {
      return textDetail.getText(titleKey);
    }
    return title || "";
  }, [titleKey, title, textDetail]);

  // Get description text - prefer textKey over direct text
  const descriptionText = useMemo(() => {
    if (descriptionKey) {
      return textDetail.getText(descriptionKey);
    }
    return description || "";
  }, [descriptionKey, description, textDetail]);

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

  if (!titleText) {
    return null;
  }

  return (
    <header className={headerClasses} data-testid={testId || "page-header"}>
      <h1 
        className={titleClasses} 
        data-testid={testId ? `${testId}-title` : "page-header-title"}
      >
        {titleText}
      </h1>
      {descriptionText && (
        <p 
          className={descriptionClasses} 
          data-testid={testId ? `${testId}-description` : "page-header-description"}
        >
          {descriptionText}
        </p>
      )}
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
