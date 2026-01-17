"use client";

import { CognitiveAlertBanner } from "./cognitive-alert-banner";

/**
 * Cognitive Alert Missing Break Component - MindEase
 * Alert shown when user has completed multiple focus sessions without taking a break
 * 
 * Shows when: 3+ focus sessions completed without break
 */
export interface CognitiveAlertMissingBreakProps {
  /** Whether alert is visible */
  isVisible: boolean;
  
  /** Number of consecutive sessions without break */
  sessionsCount: number;
  
  /** Callback when alert is dismissed */
  onDismiss: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function CognitiveAlertMissingBreak({
  isVisible,
  sessionsCount,
  onDismiss,
  "data-testid": testId,
}: CognitiveAlertMissingBreakProps) {
  return (
    <CognitiveAlertBanner
      isVisible={isVisible}
      titleKey="cognitive_alerts_missing_break_title"
      messageKey="cognitive_alerts_missing_break_message"
      onDismiss={onDismiss}
      position="top"
      variant="gentle"
      data-testid={testId || "cognitive-alert-missing-break"}
    />
  );
}

CognitiveAlertMissingBreak.displayName = "CognitiveAlertMissingBreak";
