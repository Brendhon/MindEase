"use client";

import { ReactNode, useMemo } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles } from "./settings-section-styles";

/**
 * SettingsSection Component - MindEase
 * Reusable section container for settings page
 * 
 * @example
 * ```tsx
 * <SettingsSection title="Visual Settings" description="Adjust visual preferences">
 *   <Switch ... />
 * </SettingsSection>
 * ```
 */
export interface SettingsSectionProps {
  /** Section title */
  title: string;
  
  /** Optional section description */
  description?: string;
  
  /** Section content */
  children: ReactNode;
  
  /** Custom className */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
  "data-testid": testId,
}: SettingsSectionProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  const { fontSizeClasses, spacingClasses } = useCognitiveSettings();

  // Generate title classes with fontSize preference
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.lg),
    [fontSizeClasses.lg]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.padding, spacingClasses.gap, className),
    [spacingClasses.padding, spacingClasses.gap, className]
  );

  // Generate content classes with spacing preference
  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <section className={containerClasses} data-testid={testId || "settings-section"}>
      <div className={styles.header}>
        <h2 className={titleClasses} data-testid={testId ? `${testId}-title` : "settings-section-title"}>
          {title}
        </h2>
        {description && (
          <p
            className={descriptionClasses}
            data-testid={testId ? `${testId}-description` : "settings-section-description"}
          >
            {description}
          </p>
        )}
      </div>
      <div className={contentClasses} data-testid={testId ? `${testId}-content` : "settings-section-content"}>
        {children}
      </div>
    </section>
  );
}

SettingsSection.displayName = "SettingsSection";

