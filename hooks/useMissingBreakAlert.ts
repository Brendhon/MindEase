import { useCallback, useEffect } from "react";
import { useMissingBreakAlertContext } from "@/contexts/missing-break-alert-context";
import { MISSING_BREAK_SESSIONS_THRESHOLD } from "@/components/dashboard/dashboard-cognitive-alerts/cognitive-alerts-constants";

/**
 * useMissingBreakAlert Hook - MindEase
 * 
 * Centralized hook for managing missing break alert state and business logic.
 * 
 * This hook handles:
 * - Tracking consecutive focus sessions without breaks
 * - Managing alert visibility based on business rules
 * - Resetting counters when breaks are taken or tasks are finished
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * // Record focus session completion
 * function FocusSessionDialog() {
 *   const { recordFocusSessionComplete } = useMissingBreakAlert();
 *   
 *   const handleContinueFocus = () => {
 *     recordFocusSessionComplete();
 *     // ... other logic
 *   };
 * }
 * 
 * // Check alert visibility
 * function AlertsComponent() {
 *   const { isMissingBreakAlertVisible, dismissMissingBreakAlert } = useMissingBreakAlert();
 *   
 *   return (
 *     <Alert
 *       isVisible={isMissingBreakAlertVisible}
 *       onDismiss={dismissMissingBreakAlert}
 *     />
 *   );
 * }
 * ```
 * 
 * @throws Error if used outside MissingBreakAlertProvider
 */
export function useMissingBreakAlert() {
  const {
    consecutiveFocusSessions,
    isMissingBreakAlertVisible,
    isMissingBreakAlertDismissed,
    _setConsecutiveFocusSessions,
    _setIsMissingBreakAlertVisible,
    _setIsMissingBreakAlertDismissed,
  } = useMissingBreakAlertContext();

  // Update alert visibility when consecutive sessions or dismissed state changes
  useEffect(() => {
    if (
      consecutiveFocusSessions >= MISSING_BREAK_SESSIONS_THRESHOLD &&
      !isMissingBreakAlertDismissed
    ) {
      _setIsMissingBreakAlertVisible(true);
    } else if (consecutiveFocusSessions < MISSING_BREAK_SESSIONS_THRESHOLD) {
      _setIsMissingBreakAlertVisible(false);
    }
  }, [consecutiveFocusSessions, isMissingBreakAlertDismissed, _setIsMissingBreakAlertVisible]);

  /**
   * Record that a focus session was completed without taking a break
   * Increments the counter (alert visibility is handled by useEffect)
   */
  const recordFocusSessionComplete = useCallback(() => {
    _setConsecutiveFocusSessions((prev) => prev + 1);
  }, [_setConsecutiveFocusSessions]);

  /**
   * Record that a break was completed
   * Resets the counter and hides the alert
   */
  const recordBreakComplete = useCallback(() => {
    _setConsecutiveFocusSessions(0);
    _setIsMissingBreakAlertVisible(false);
    _setIsMissingBreakAlertDismissed(false); // Allow alert to show again in the future
  }, [_setConsecutiveFocusSessions, _setIsMissingBreakAlertVisible, _setIsMissingBreakAlertDismissed]);

  /**
   * Record that a task was finished
   * Resets the counter (task finished = end of cycle)
   */
  const recordTaskFinished = useCallback(() => {
    _setConsecutiveFocusSessions(0);
    _setIsMissingBreakAlertVisible(false);
    _setIsMissingBreakAlertDismissed(false); // Allow alert to show again in the future
  }, [_setConsecutiveFocusSessions, _setIsMissingBreakAlertVisible, _setIsMissingBreakAlertDismissed]);

  /**
   * Dismiss the missing break alert
   * Hides the alert but keeps the counter (user still needs to take a break)
   */
  const dismissMissingBreakAlert = useCallback(() => {
    _setIsMissingBreakAlertVisible(false);
    _setIsMissingBreakAlertDismissed(true);
  }, [_setIsMissingBreakAlertVisible, _setIsMissingBreakAlertDismissed]);

  return {
    // State
    consecutiveFocusSessions,
    isMissingBreakAlertVisible,
    
    // Operations
    recordFocusSessionComplete,
    recordBreakComplete,
    recordTaskFinished,
    dismissMissingBreakAlert,
  };
}
