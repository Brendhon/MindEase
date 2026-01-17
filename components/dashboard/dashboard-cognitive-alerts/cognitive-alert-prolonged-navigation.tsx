"use client";

import { CognitiveAlertBanner } from "./cognitive-alert-banner";
import { CognitiveAlertProps } from "@/models/dashboard";

/**
 * Cognitive Alert Prolonged Navigation Component - MindEase
 * Alert shown when user has been navigating the app for a long time without taking action
 * 
 * Shows when: user has been navigating >X minutes without completing subtasks, starting focus, or other actions
 */
export interface CognitiveAlertProlongedNavigationProps extends CognitiveAlertProps {}

export function CognitiveAlertProlongedNavigation({
  isVisible,
  onDismiss,
  "data-testid": testId,
}: CognitiveAlertProlongedNavigationProps) {
  return (
    <CognitiveAlertBanner
      isVisible={isVisible}
      titleKey="cognitive_alerts_prolonged_navigation_title"
      messageKey="cognitive_alerts_prolonged_navigation_message"
      onDismiss={onDismiss}
      data-testid={testId || "cognitive-alert-prolonged-navigation"}
    />
  );
}

CognitiveAlertProlongedNavigation.displayName = "CognitiveAlertProlongedNavigation";
