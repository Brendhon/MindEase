"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useTextDetail } from "@/hooks/useTextDetail";
import { cn } from "@/utils/ui";
import { X } from "lucide-react";
import { useMemo } from "react";
import { getContrastClassesForAlerts, styles } from "./dashboard-cognitive-alerts-styles";
import { AccessibilityTextKey } from "@/utils/accessibility/content";

/**
 * Cognitive Alert Banner Component - MindEase
 * Base banner component for cognitive alerts
 * 
 * Displays a discrete, non-blocking informational banner with:
 * - Accessible ARIA attributes (role="status", aria-live="polite")
 * - Dismiss button
 * - Support for contrast modes
 * - Responsive layout
 */
export interface CognitiveAlertBannerProps {
  /** Whether banner is visible */
  isVisible: boolean;
  
  /** Translation key for title */
  titleKey: AccessibilityTextKey;
  
  /** Translation key for message */
  messageKey: AccessibilityTextKey;
  
  /** Callback when banner is dismissed */
  onDismiss: () => void;
  
  /** Position of banner (top or bottom) */
  position?: "top" | "bottom";
  
  /** Visual variant (info or gentle) */
  variant?: "info" | "gentle";
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function CognitiveAlertBanner({
  isVisible,
  titleKey,
  messageKey,
  onDismiss,
  position = "top",
  variant = "info",
  "data-testid": testId,
}: CognitiveAlertBannerProps) {
  const { getText } = useTextDetail();
  const { fontSizeClasses, spacingClasses, animationClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();

  if (!isVisible) {
    return null;
  }

  // Get variant-specific styles
  const variantStyles = styles.variant[variant];
  const positionStyles = styles.position[position];

  // Generate accessible classes with memoization
  const bannerClasses = useMemo(
    () => cn(
      styles.banner,
      variantStyles.banner,
      positionStyles,
      spacingClasses.padding,
      animationClasses,
      getContrastClassesForAlerts(settings.contrast, "banner")
    ),
    [variantStyles.banner, positionStyles, spacingClasses.padding, animationClasses, settings.contrast]
  );

  const titleClasses = useMemo(
    () => cn(
      styles.bannerTitle,
      variantStyles.title,
      fontSizeClasses.base
    ),
    [variantStyles.title, fontSizeClasses.base]
  );

  const messageClasses = useMemo(
    () => cn(
      styles.bannerMessage,
      fontSizeClasses.sm
    ),
    [fontSizeClasses.sm]
  );

  const dismissButtonClasses = useMemo(
    () => cn(
      styles.dismissButton,
      animationClasses
    ),
    [animationClasses]
  );

  const dismissAriaLabel = getText("cognitive_alerts_dismiss_aria") || "Dismiss alert";

  return (
    <div
      className={bannerClasses}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId || "cognitive-alert-banner"}
    >
      <div className={styles.bannerContent}>
        <h3 className={titleClasses}>
          {getText(titleKey)}
        </h3>
        <p className={messageClasses}>
          {getText(messageKey)}
        </p>
      </div>
      <div className={styles.bannerActions}>
        <button
          type="button"
          onClick={onDismiss}
          className={dismissButtonClasses}
          aria-label={dismissAriaLabel}
          data-testid={testId ? `${testId}-dismiss` : "cognitive-alert-dismiss"}
        >
          <X className={styles.dismissIcon} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

CognitiveAlertBanner.displayName = "CognitiveAlertBanner";
