"use client";

import { cn } from "@/utils/ui";
import { useTextDetail } from "@/hooks/useTextDetail";
import { AccessibilityTextKey } from "@/utils/accessibility/content";

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
  
  return (
    <div className={cn(styles.infoRow, className)} data-testid={testId}>
      <span className={cn(styles.label, labelClassName)}>{getText(labelKey)}</span>
      <span className={cn(styles.value, valueClassName)}>{value}</span>
    </div>
  );
}

ProfileInfoRow.displayName = "ProfileInfoRow";

const styles = {
  infoRow: "flex flex-col gap-1",
  label: "text-text-secondary font-medium",
  value: "text-text-primary",
} as const;
