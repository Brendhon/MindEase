import { useCallback, useEffect } from "react";
import { useExcessiveTimeAlertContext } from "@/contexts/excessive-time-alert-context";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import {
  EXCESSIVE_TIME_THRESHOLD_MS,
  ADVANCED_EXCESSIVE_TIME_THRESHOLD_MS,
  COGNITIVE_ALERT_DISMISS_EXPIRY_MS
} from "@/utils/cognitive-alerts";

/**
 * useExcessiveTimeAlert Hook - MindEase
 * 
 * Centralized hook for managing excessive time alert state and business logic.
 * 
 * This hook handles:
 * - Tracking continuous focus time on the same task
 * - Determining threshold based on user level (60 min default, 90 min advanced)
 * - Managing alert visibility based on business rules
 * - Resetting tracking when task changes or focus stops
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * // Check alert visibility
 * function AlertsComponent() {
 *   const { isExcessiveTimeAlertVisible, dismissExcessiveTimeAlert } = useExcessiveTimeAlert();
 *   
 *   return (
 *     <Alert
 *       isVisible={isExcessiveTimeAlertVisible}
 *       onDismiss={dismissExcessiveTimeAlert}
 *     />
 *   );
 * }
 * ```
 * 
 * @throws Error if used outside ExcessiveTimeAlertProvider
 */
export function useExcessiveTimeAlert() {
  const {
    currentTaskId,
    focusStartTimestamp,
    isExcessiveTimeAlertVisible,
    isExcessiveTimeAlertDismissed,
    dismissedAt,
    _setCurrentTaskId,
    _setFocusStartTimestamp,
    _setIsExcessiveTimeAlertVisible,
    _setIsExcessiveTimeAlertDismissed,
    _setDismissedAt,
  } = useExcessiveTimeAlertContext();

  const { timerState } = useFocusTimer();
  const { settings } = useCognitiveSettings();

  // Determine threshold based on user level
  // Advanced users have focusDuration > 25 minutes (default)
  const isAdvancedUser = useCallback(() => {
    return (settings.focusDuration || 25) > 25;
  }, [settings.focusDuration]);

  const threshold = isAdvancedUser() 
    ? ADVANCED_EXCESSIVE_TIME_THRESHOLD_MS 
    : EXCESSIVE_TIME_THRESHOLD_MS;

  // Track focus timer state changes to detect task changes
  // Tracking continues even when timer completes (idle with activeTaskId) - only resets when task changes or timer stops completely
  useEffect(() => {
    const activeTaskId = timerState.activeTaskId;

    if (activeTaskId) {
      // Task is in focus (running or just completed)
      if (currentTaskId !== activeTaskId) {
        // Task changed - reset tracking
        _setCurrentTaskId(activeTaskId);
        _setFocusStartTimestamp(Date.now());
        _setIsExcessiveTimeAlertVisible(false);
        // Don't reset dismissed state - let dismiss expire naturally after 2h
      } else if (currentTaskId === null) {
        // Same task but tracking wasn't started yet - start tracking
        _setCurrentTaskId(activeTaskId);
        _setFocusStartTimestamp(Date.now());
      }
      // If same task, keep tracking (timestamp already set)
    } else {
      // No task in focus - reset tracking
      if (currentTaskId !== null) {
        _setCurrentTaskId(null);
        _setFocusStartTimestamp(null);
        _setIsExcessiveTimeAlertVisible(false);
      }
    }
  }, [
    timerState.activeTaskId,
    currentTaskId,
    _setCurrentTaskId,
    _setFocusStartTimestamp,
    _setIsExcessiveTimeAlertVisible,
  ]);

  // Check if dismiss has expired (2 hours)
  useEffect(() => {
    if (dismissedAt === null) return;

    const checkExpiry = () => {
      const now = Date.now();
      const timeSinceDismiss = now - dismissedAt;

      if (timeSinceDismiss >= COGNITIVE_ALERT_DISMISS_EXPIRY_MS) {
        // Dismiss expired - reset dismissed state
        _setIsExcessiveTimeAlertDismissed(false);
        _setDismissedAt(null);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every minute to see if dismiss expired
    const intervalId = setInterval(checkExpiry, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dismissedAt, _setIsExcessiveTimeAlertDismissed, _setDismissedAt]);

  // Monitor continuous focus time and update alert visibility
  // Check time even when timer is idle (between sessions) - continuous focus on same task
  useEffect(() => {
    if (focusStartTimestamp === null || currentTaskId === null) return;
    if (timerState.activeTaskId !== currentTaskId) return; // Only check if task is still active

    const checkExcessiveTime = () => {
      const now = Date.now();
      const continuousFocusTime = now - focusStartTimestamp;

      // Show alert if threshold reached and not dismissed
      if (
        continuousFocusTime >= threshold &&
        !isExcessiveTimeAlertDismissed
      ) {
        _setIsExcessiveTimeAlertVisible(true);
      } else {
        _setIsExcessiveTimeAlertVisible(false);
      }
    };

    // Check immediately
    checkExcessiveTime();

    // Check every minute
    const intervalId = setInterval(checkExcessiveTime, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [
    focusStartTimestamp,
    currentTaskId,
    timerState.activeTaskId,
    threshold,
    isExcessiveTimeAlertDismissed,
    _setIsExcessiveTimeAlertVisible,
  ]);

  /**
   * Dismiss the excessive time alert
   * Hides the alert but keeps tracking focus time
   * Dismiss expires after 2 hours
   */
  const dismissExcessiveTimeAlert = useCallback(() => {
    _setIsExcessiveTimeAlertVisible(false);
    _setIsExcessiveTimeAlertDismissed(true);
    _setDismissedAt(Date.now()); // Store current timestamp
  }, [
    _setIsExcessiveTimeAlertVisible,
    _setIsExcessiveTimeAlertDismissed,
    _setDismissedAt,
  ]);

  return {
    // State
    isExcessiveTimeAlertVisible,

    // Operations
    dismissExcessiveTimeAlert,
  };
}
