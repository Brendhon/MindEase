import { createContext, useContext } from "react";

/**
 * Prolonged Navigation Alert Context - MindEase
 * 
 * Context for tracking navigation time without user actions.
 * 
 * This context provides ONLY basic state:
 * - Navigation tracking timestamps
 * - Alert visibility states
 * - Internal setters for useProlongedNavigationAlert hook
 * 
 * All business logic (navigation tracking, alert rules, state management)
 * is handled by the useProlongedNavigationAlert hook. Components should use useProlongedNavigationAlert(), not useProlongedNavigationAlertContext().
 */
interface ProlongedNavigationAlertContextValue {
  /** Timestamp of last user action (subtask completion or focus start) */
  lastActionTimestamp: number | null;
  
  /** Whether prolonged navigation alert is visible */
  isProlongedNavigationAlertVisible: boolean;
  
  /** Whether prolonged navigation alert has been dismissed */
  isProlongedNavigationAlertDismissed: boolean;
  
  /** Timestamp when alert was dismissed (in milliseconds) */
  dismissedAt: number | null;
  
  // Internal setters - only used by useProlongedNavigationAlert hook
  _setLastActionTimestamp: (timestamp: number | null) => void;
  _setIsProlongedNavigationAlertVisible: (visible: boolean) => void;
  _setIsProlongedNavigationAlertDismissed: (dismissed: boolean) => void;
  _setDismissedAt: (timestamp: number | null) => void;
}

export const ProlongedNavigationAlertContext = createContext<
  ProlongedNavigationAlertContextValue | undefined
>(undefined);

/**
 * Hook to access prolonged navigation alert context
 * 
 * ⚠️ **Note**: This hook is for internal use by useProlongedNavigationAlert hook only.
 * Components should use useProlongedNavigationAlert() instead, which provides all business logic.
 * 
 * @throws Error if used outside ProlongedNavigationAlertProvider
 * 
 * @internal
 */
export function useProlongedNavigationAlertContext(): ProlongedNavigationAlertContextValue {
  const context = useContext(ProlongedNavigationAlertContext);
  
  if (!context) {
    throw new Error(
      "useProlongedNavigationAlertContext must be used within ProlongedNavigationAlertProvider"
    );
  }
  
  return context;
}
