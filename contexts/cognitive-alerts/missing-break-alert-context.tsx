import { createContext, useContext } from "react";

/**
 * Missing Break Alert Context - MindEase
 * 
 * Context for tracking consecutive focus sessions without breaks.
 * 
 * This context provides ONLY basic state:
 * - Session tracking counters
 * - Alert visibility states
 * - Internal setters for useMissingBreakAlert hook
 * 
 * All business logic (session tracking, alert rules, state management)
 * is handled by the useMissingBreakAlert hook. Components should use useMissingBreakAlert(), not useMissingBreakAlertContext().
 */
interface MissingBreakAlertContextValue {
  /** Number of consecutive focus sessions without break */
  consecutiveFocusSessions: number;
  
  /** Whether missing break alert is visible */
  isMissingBreakAlertVisible: boolean;
  
  /** Whether missing break alert has been dismissed */
  isMissingBreakAlertDismissed: boolean;
  
  /** Timestamp when alert was dismissed (in milliseconds) */
  dismissedAt: number | null;
  
  // Internal setters - only used by useMissingBreakAlert hook
  _setConsecutiveFocusSessions: (count: number | ((prev: number) => number)) => void;
  _setIsMissingBreakAlertVisible: (visible: boolean) => void;
  _setIsMissingBreakAlertDismissed: (dismissed: boolean) => void;
  _setDismissedAt: (timestamp: number | null) => void;
}

export const MissingBreakAlertContext = createContext<
  MissingBreakAlertContextValue | undefined
>(undefined);

/**
 * Hook to access missing break alert context
 * 
 * ⚠️ **Note**: This hook is for internal use by useMissingBreakAlert hook only.
 * Components should use useMissingBreakAlert() instead, which provides all business logic.
 * 
 * @throws Error if used outside MissingBreakAlertProvider
 * 
 * @internal
 */
export function useMissingBreakAlertContext(): MissingBreakAlertContextValue {
  const context = useContext(MissingBreakAlertContext);
  
  if (!context) {
    throw new Error(
      "useMissingBreakAlertContext must be used within MissingBreakAlertProvider"
    );
  }
  
  return context;
}
