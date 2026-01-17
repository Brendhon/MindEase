"use client";

import { ExcessiveTimeAlertContext } from "@/contexts/excessive-time-alert-context";
import { useCallback, useState } from "react";

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
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [focusStartTimestamp, setFocusStartTimestamp] = useState<number | null>(null);
  const [isExcessiveTimeAlertVisible, setIsExcessiveTimeAlertVisible] = useState(false);
  const [isExcessiveTimeAlertDismissed, setIsExcessiveTimeAlertDismissed] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  // Internal setters for useExcessiveTimeAlert hook to use
  const setCurrentTaskIdState = useCallback(
    (taskId: string | null) => setCurrentTaskId(taskId),
    []
  );

  const setFocusStartTimestampState = useCallback(
    (timestamp: number | null) => setFocusStartTimestamp(timestamp),
    []
  );

  const setIsExcessiveTimeAlertVisibleState = useCallback(
    (visible: boolean) => setIsExcessiveTimeAlertVisible(visible),
    []
  );

  const setIsExcessiveTimeAlertDismissedState = useCallback(
    (dismissed: boolean) => setIsExcessiveTimeAlertDismissed(dismissed),
    []
  );

  const setDismissedAtState = useCallback(
    (timestamp: number | null) => setDismissedAt(timestamp),
    []
  );

  return (
    <ExcessiveTimeAlertContext.Provider
      value={{
        currentTaskId,
        focusStartTimestamp,
        isExcessiveTimeAlertVisible,
        isExcessiveTimeAlertDismissed,
        dismissedAt,
        _setCurrentTaskId: setCurrentTaskIdState,
        _setFocusStartTimestamp: setFocusStartTimestampState,
        _setIsExcessiveTimeAlertVisible: setIsExcessiveTimeAlertVisibleState,
        _setIsExcessiveTimeAlertDismissed: setIsExcessiveTimeAlertDismissedState,
        _setDismissedAt: setDismissedAtState,
      }}
    >
      {children}
    </ExcessiveTimeAlertContext.Provider>
  );
}
