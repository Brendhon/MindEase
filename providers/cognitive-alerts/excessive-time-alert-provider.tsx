'use client';

import { ExcessiveTimeAlertContext } from '@/contexts/cognitive-alerts';
import { useCommonAlertState } from './create-alert-provider';
import { useCallback, useState } from 'react';

interface ExcessiveTimeAlertProviderProps {
  children: React.ReactNode;
}

/**
 * Excessive Time Alert Provider - MindEase
 *
 * Provides excessive time alert context to children components.
 *
 * This provider manages ONLY basic state (task tracking, alert visibility).
 * All business logic is handled by the useExcessiveTimeAlert hook.
 */
export function ExcessiveTimeAlertProvider({
  children,
}: ExcessiveTimeAlertProviderProps) {
  // Common alert state
  const commonState = useCommonAlertState();

  // Additional state specific to excessive time alert
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [focusStartTimestamp, setFocusStartTimestamp] = useState<number | null>(
    null
  );

  // Setters for additional state
  const setCurrentTaskIdState = useCallback(
    (taskId: string | null) => setCurrentTaskId(taskId),
    []
  );

  const setFocusStartTimestampState = useCallback(
    (timestamp: number | null) => setFocusStartTimestamp(timestamp),
    []
  );

  return (
    <ExcessiveTimeAlertContext.Provider
      value={{
        currentTaskId,
        focusStartTimestamp,
        isExcessiveTimeAlertVisible: commonState.isVisible,
        isExcessiveTimeAlertDismissed: commonState.isDismissed,
        dismissedAt: commonState.dismissedAt,
        _setCurrentTaskId: setCurrentTaskIdState,
        _setFocusStartTimestamp: setFocusStartTimestampState,
        _setIsExcessiveTimeAlertVisible: commonState.setIsVisible,
        _setIsExcessiveTimeAlertDismissed: commonState.setIsDismissed,
        _setDismissedAt: commonState.setDismissedAt,
      }}
    >
      {children}
    </ExcessiveTimeAlertContext.Provider>
  );
}
