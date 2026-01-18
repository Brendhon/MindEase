'use client';

import { MissingBreakAlertContext } from '@/contexts/cognitive-alerts';
import { useCommonAlertState } from './create-alert-provider';
import { useCallback, useState } from 'react';

interface MissingBreakAlertProviderProps {
  children: React.ReactNode;
}

/**
 * Missing Break Alert Provider - MindEase
 *
 * Provides missing break alert context to children components.
 *
 * This provider manages ONLY basic state (session counters, alert visibility).
 * All business logic is handled by the useMissingBreakAlert hook.
 */
export function MissingBreakAlertProvider({
  children,
}: MissingBreakAlertProviderProps) {
  // Common alert state
  const commonState = useCommonAlertState();

  // Additional state specific to missing break alert
  const [consecutiveFocusSessions, setConsecutiveFocusSessions] = useState(0);

  // Setters for additional state
  const setConsecutiveFocusSessionsState = useCallback(
    (count: number | ((prev: number) => number)) =>
      setConsecutiveFocusSessions(count),
    []
  );

  return (
    <MissingBreakAlertContext.Provider
      value={{
        consecutiveFocusSessions,
        isMissingBreakAlertVisible: commonState.isVisible,
        isMissingBreakAlertDismissed: commonState.isDismissed,
        dismissedAt: commonState.dismissedAt,
        _setConsecutiveFocusSessions: setConsecutiveFocusSessionsState,
        _setIsMissingBreakAlertVisible: commonState.setIsVisible,
        _setIsMissingBreakAlertDismissed: commonState.setIsDismissed,
        _setDismissedAt: commonState.setDismissedAt,
      }}
    >
      {children}
    </MissingBreakAlertContext.Provider>
  );
}
