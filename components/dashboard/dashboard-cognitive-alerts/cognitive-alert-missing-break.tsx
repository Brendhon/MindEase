'use client';

import { CognitiveAlertBanner } from './cognitive-alert-banner';
import { CognitiveAlertProps } from '@/models/dashboard';

/**
 * Cognitive Alert Missing Break Component - MindEase
 * Alert shown when user has completed multiple focus sessions without taking a break
 *
 * Shows when: 3+ focus sessions completed without break
 */
export interface CognitiveAlertMissingBreakProps extends CognitiveAlertProps {}

export function CognitiveAlertMissingBreak({
  isVisible,
  onDismiss,
  'data-testid': testId,
}: CognitiveAlertMissingBreakProps) {
  return (
    <CognitiveAlertBanner
      isVisible={isVisible}
      titleKey="cognitive_alerts_missing_break_title"
      messageKey="cognitive_alerts_missing_break_message"
      onDismiss={onDismiss}
      data-testid={testId || 'cognitive-alert-missing-break'}
    />
  );
}

CognitiveAlertMissingBreak.displayName = 'CognitiveAlertMissingBreak';
