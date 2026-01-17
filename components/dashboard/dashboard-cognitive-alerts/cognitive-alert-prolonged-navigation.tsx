"use client";

import { CognitiveAlertBanner } from "./cognitive-alert-banner";

/**
 * Cognitive Alert Prolonged Navigation Component - MindEase
 * Alert shown when user has been navigating the app for a long time without taking action
 * 
 * Shows when: user has been navigating >X minutes without completing subtasks, starting focus, or other actions
 */
export interface CognitiveAlertProlongedNavigationProps {
  /** Whether alert is visible */
  isVisible: boolean;
  
  /** Navigation time in milliseconds */
  navigationTime: number;
  
  /** Callback when alert is dismissed */
  onDismiss: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function CognitiveAlertProlongedNavigation({
  isVisible,
  navigationTime,
  onDismiss,
  "data-testid": testId,
}: CognitiveAlertProlongedNavigationProps) {
  return (
    <CognitiveAlertBanner
      isVisible={isVisible}
      titleKey="cognitive_alerts_prolonged_navigation_title"
      messageKey="cognitive_alerts_prolonged_navigation_message"
      onDismiss={onDismiss}
      position="bottom"
      variant="gentle"
      data-testid={testId || "cognitive-alert-prolonged-navigation"}
    />
  );
}

CognitiveAlertProlongedNavigation.displayName = "CognitiveAlertProlongedNavigation";
