'use client';

import {
  useExcessiveTimeAlert,
  useMissingBreakAlert,
  useProlongedNavigationAlert,
} from '@/hooks/cognitive-alerts';
import { CognitiveAlertExcessiveTime } from './cognitive-alert-excessive-time';
import { CognitiveAlertMissingBreak } from './cognitive-alert-missing-break';
import { CognitiveAlertProlongedNavigation } from './cognitive-alert-prolonged-navigation';
import { BaseComponentProps } from '@/models/base';

/**
 * DashboardCognitiveAlerts Component - MindEase
 * Display cognitive alerts based on task focus time, break patterns, and navigation behavior
 *
 * Alerts:
 * - Excessive time: Same task in focus for >60-90 min
 * - Missing break: Multiple focus sessions without break
 * - Prolonged navigation: Navigating without actions for extended time
 *
 * Priority: excessive_time > missing_break > prolonged_navigation
 */
export interface DashboardCognitiveAlertsProps extends BaseComponentProps {}

export function DashboardCognitiveAlerts({
  'data-testid': testId,
}: DashboardCognitiveAlertsProps) {
  const { isMissingBreakAlertVisible, dismissMissingBreakAlert } =
    useMissingBreakAlert();
  const { isProlongedNavigationAlertVisible, dismissProlongedNavigationAlert } =
    useProlongedNavigationAlert();
  const { isExcessiveTimeAlertVisible, dismissExcessiveTimeAlert } =
    useExcessiveTimeAlert();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId || 'dashboard-cognitive-alerts'}
    >
      <CognitiveAlertExcessiveTime
        isVisible={isExcessiveTimeAlertVisible}
        onDismiss={dismissExcessiveTimeAlert}
      />
      <CognitiveAlertMissingBreak
        isVisible={isMissingBreakAlertVisible}
        onDismiss={dismissMissingBreakAlert}
      />
      <CognitiveAlertProlongedNavigation
        isVisible={isProlongedNavigationAlertVisible}
        onDismiss={dismissProlongedNavigationAlert}
      />
    </div>
  );
}

DashboardCognitiveAlerts.displayName = 'DashboardCognitiveAlerts';
