"use client";

import { CognitiveAlertBanner } from "./cognitive-alert-banner";

/**
 * Cognitive Alert Excessive Time Component - MindEase
 * Alert shown when user has been focusing on the same task for too long
 * 
 * Shows when: same task in focus for >60-90 min (2-3 standard sessions)
 */
export interface CognitiveAlertExcessiveTimeProps {
  /** Whether alert is visible */
  isVisible: boolean;
  
  /** Task name that has been in focus */
  taskName?: string;
  
  /** Elapsed time in milliseconds */
  elapsedTime: number;
  
  /** Callback when alert is dismissed */
  onDismiss: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function CognitiveAlertExcessiveTime({
  isVisible,
  taskName,
  elapsedTime,
  onDismiss,
  "data-testid": testId,
}: CognitiveAlertExcessiveTimeProps) {
  return (
    <CognitiveAlertBanner
      isVisible={isVisible}
      titleKey="cognitive_alerts_excessive_time_title"
      messageKey="cognitive_alerts_excessive_time_message"
      onDismiss={onDismiss}
      position="top"
      variant="info"
      data-testid={testId || "cognitive-alert-excessive-time"}
    />
  );
}

CognitiveAlertExcessiveTime.displayName = "CognitiveAlertExcessiveTime";
