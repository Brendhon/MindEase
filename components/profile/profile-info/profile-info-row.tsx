"use client";

import { cn } from "@/utils/ui";
import { useTextDetail } from "@/hooks/useTextDetail";
import { AccessibilityTextKey } from "@/utils/accessibility/content";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useMemo } from "react";
import { styles } from "./profile-info-styles";

/**
 * ProfileInfoRow Component - MindEase
 * Displays a label-value pair for user information
 */
export interface ProfileInfoRowProps {
  /** Label key from accessibility-texts.json */
  labelKey: AccessibilityTextKey;
  
  /** Value text */
  value: string;
  
  /** Label CSS classes */
  labelClassName?: string;
  
  /** Value CSS classes */
  valueClassName?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileInfoRow({ 
  labelKey, 
  value,
  labelClassName,
  valueClassName,
  className,
  "data-testid": testId 
}: ProfileInfoRowProps) {
  const { getText } = useTextDetail();
  const { fontSizeClasses, spacingClasses, animationClasses } = useAccessibilityClasses();
  
  // Generate accessible classes with memoization
  const rowClasses = useMemo(
    () => cn(
      styles.infoRow,
      spacingClasses.gap,
      animationClasses,
      className
    ),
    [spacingClasses.gap, animationClasses, className]
  );
  
  const labelClasses = useMemo(
    () => cn(
      styles.label,
      fontSizeClasses.sm,
      labelClassName
    ),
    [fontSizeClasses.sm, labelClassName]
  );
  
  const valueClasses = useMemo(
    () => cn(
      styles.value,
      fontSizeClasses.base,
      valueClassName
    ),
    [fontSizeClasses.base, valueClassName]
  );
  
  return (
    <div className={rowClasses} data-testid={testId}>
      <span className={labelClasses}>{getText(labelKey)}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
}

ProfileInfoRow.displayName = "ProfileInfoRow";
