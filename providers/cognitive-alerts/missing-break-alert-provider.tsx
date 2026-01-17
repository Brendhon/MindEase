"use client";

import { MissingBreakAlertContext } from "@/contexts/cognitive-alerts";
import { useCallback, useState } from "react";

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
  const [consecutiveFocusSessions, setConsecutiveFocusSessions] = useState(0);
  const [isMissingBreakAlertVisible, setIsMissingBreakAlertVisible] = useState(false);
  const [isMissingBreakAlertDismissed, setIsMissingBreakAlertDismissed] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  // Internal setters for useMissingBreakAlert hook to use
  const setConsecutiveFocusSessionsState = useCallback(
    (count: number | ((prev: number) => number)) => setConsecutiveFocusSessions(count),
    []
  );

  const setIsMissingBreakAlertVisibleState = useCallback(
    (visible: boolean) => setIsMissingBreakAlertVisible(visible),
    []
  );

  const setIsMissingBreakAlertDismissedState = useCallback(
    (dismissed: boolean) => setIsMissingBreakAlertDismissed(dismissed),
    []
  );

  const setDismissedAtState = useCallback(
    (timestamp: number | null) => setDismissedAt(timestamp),
    []
  );

  return (
    <MissingBreakAlertContext.Provider
      value={{
        consecutiveFocusSessions,
        isMissingBreakAlertVisible,
        isMissingBreakAlertDismissed,
        dismissedAt,
        _setConsecutiveFocusSessions: setConsecutiveFocusSessionsState,
        _setIsMissingBreakAlertVisible: setIsMissingBreakAlertVisibleState,
        _setIsMissingBreakAlertDismissed: setIsMissingBreakAlertDismissedState,
        _setDismissedAt: setDismissedAtState,
      }}
    >
      {children}
    </MissingBreakAlertContext.Provider>
  );
}
