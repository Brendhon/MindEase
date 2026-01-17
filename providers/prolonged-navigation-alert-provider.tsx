"use client";

import { ProlongedNavigationAlertContext } from "@/contexts/prolonged-navigation-alert-context";
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
  const [lastActionTimestamp, setLastActionTimestamp] = useState<number | null>(null);
  const [isProlongedNavigationAlertVisible, setIsProlongedNavigationAlertVisible] = useState(false);
  const [isProlongedNavigationAlertDismissed, setIsProlongedNavigationAlertDismissed] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  // Internal setters for useProlongedNavigationAlert hook to use
  const setLastActionTimestampState = useCallback(
    (timestamp: number | null) => setLastActionTimestamp(timestamp),
    []
  );

  const setIsProlongedNavigationAlertVisibleState = useCallback(
    (visible: boolean) => setIsProlongedNavigationAlertVisible(visible),
    []
  );

  const setIsProlongedNavigationAlertDismissedState = useCallback(
    (dismissed: boolean) => setIsProlongedNavigationAlertDismissed(dismissed),
    []
  );

  const setDismissedAtState = useCallback(
    (timestamp: number | null) => setDismissedAt(timestamp),
    []
  );

  return (
    <ProlongedNavigationAlertContext.Provider
      value={{
        lastActionTimestamp,
        isProlongedNavigationAlertVisible,
        isProlongedNavigationAlertDismissed,
        dismissedAt,
        _setLastActionTimestamp: setLastActionTimestampState,
        _setIsProlongedNavigationAlertVisible: setIsProlongedNavigationAlertVisibleState,
        _setIsProlongedNavigationAlertDismissed: setIsProlongedNavigationAlertDismissedState,
        _setDismissedAt: setDismissedAtState,
      }}
    >
      {children}
    </ProlongedNavigationAlertContext.Provider>
  );
}
