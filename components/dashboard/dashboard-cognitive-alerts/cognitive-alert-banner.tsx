"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useTextDetail } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { X, BellRing } from "lucide-react";
import { useMemo } from "react";
import { getContrastClassesForAlerts, styles } from "./dashboard-cognitive-alerts-styles";
import { AccessibilityTextKey } from "@/utils/accessibility/content";
import { BaseComponentProps } from "@/models/base";

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
export interface CognitiveAlertBannerProps extends BaseComponentProps {
  /** Whether banner is visible */
  isVisible: boolean;
  
  /** Translation key for title */
  titleKey: AccessibilityTextKey;
  
  /** Translation key for message */
  messageKey: AccessibilityTextKey;
  
  /** Callback when banner is dismissed */
  onDismiss: () => void;
}

export function CognitiveAlertBanner({
  isVisible,
  titleKey,
  messageKey,
  onDismiss,
  "data-testid": testId,
}: CognitiveAlertBannerProps) {
  const { getText } = useTextDetail();
  const { fontSizeClasses, spacingClasses, animationClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();

  // Generate accessible classes with memoization
  const bannerClasses = useMemo(
    () => cn(
      styles.banner,
      spacingClasses.padding,
      animationClasses,
      getContrastClassesForAlerts(settings.contrast, "banner")
    ),
    [spacingClasses.padding, animationClasses, settings.contrast]
  );

  const titleClasses = useMemo(
    () => cn(
      styles.bannerTitle,
      fontSizeClasses.base
    ),
    [fontSizeClasses.base]
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

  const iconClasses = useMemo(
    () => cn(
      styles.icon.color,
      settings.animations ? styles.icon.animate : ""
    ),
    [styles.icon.color, styles.icon.animate, settings.animations]
  );

  const dismissAriaLabel = getText("cognitive_alerts_dismiss_aria") || "Dismiss alert";

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={bannerClasses}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId || "cognitive-alert-banner"}
    >
      <div className={styles.icon.base}>
        <BellRing className={iconClasses} aria-hidden="true" size={24} />  
      </div>
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
