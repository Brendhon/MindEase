"use client";

import { ProlongedNavigationAlertContext } from "@/contexts/cognitive-alerts";
import { useCommonAlertState } from "./create-alert-provider";
import { useCallback, useState } from "react";

interface ProlongedNavigationAlertProviderProps {
  children: React.ReactNode;
}

/**
 * Prolonged Navigation Alert Provider - MindEase
 * 
 * Provides prolonged navigation alert context to children components.
 * 
 * This provider manages ONLY basic state (navigation timestamps, alert visibility).
 * All business logic is handled by the useProlongedNavigationAlert hook.
 */
export function ProlongedNavigationAlertProvider({
  children,
}: ProlongedNavigationAlertProviderProps) {
  // Common alert state
  const commonState = useCommonAlertState();

  // Additional state specific to prolonged navigation alert
  const [lastActionTimestamp, setLastActionTimestamp] = useState<number | null>(null);

  // Setters for additional state
  const setLastActionTimestampState = useCallback(
    (timestamp: number | null) => setLastActionTimestamp(timestamp),
    []
  );

  return (
    <ProlongedNavigationAlertContext.Provider
      value={{
        lastActionTimestamp,
        isProlongedNavigationAlertVisible: commonState.isVisible,
        isProlongedNavigationAlertDismissed: commonState.isDismissed,
        dismissedAt: commonState.dismissedAt,
        _setLastActionTimestamp: setLastActionTimestampState,
        _setIsProlongedNavigationAlertVisible: commonState.setIsVisible,
        _setIsProlongedNavigationAlertDismissed: commonState.setIsDismissed,
        _setDismissedAt: commonState.setDismissedAt,
      }}
    >
      {children}
    </ProlongedNavigationAlertContext.Provider>
  );
}
