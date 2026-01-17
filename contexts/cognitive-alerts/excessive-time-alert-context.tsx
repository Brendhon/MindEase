import { createContext, useContext } from "react";

/**
 * Excessive Time Alert Context - MindEase
 * 
 * Context for tracking continuous focus time on the same task.
 * 
 * This context provides ONLY basic state:
 * - Task tracking (current task in focus and start timestamp)
 * - Alert visibility states
 * - Internal setters for useExcessiveTimeAlert hook
 * 
 * All business logic (time tracking, alert rules, state management)
 * is handled by the useExcessiveTimeAlert hook. Components should use useExcessiveTimeAlert(), not useExcessiveTimeAlertContext().
 */
interface ExcessiveTimeAlertContextValue {
  /** ID of the task currently in continuous focus */
  currentTaskId: string | null;
  
  /** Timestamp when continuous focus started on current task (in milliseconds) */
  focusStartTimestamp: number | null;
  
  /** Whether excessive time alert is visible */
  isExcessiveTimeAlertVisible: boolean;
  
  /** Whether excessive time alert has been dismissed */
  isExcessiveTimeAlertDismissed: boolean;
  
  /** Timestamp when alert was dismissed (in milliseconds) */
  dismissedAt: number | null;
  
  // Internal setters - only used by useExcessiveTimeAlert hook
  _setCurrentTaskId: (taskId: string | null) => void;
  _setFocusStartTimestamp: (timestamp: number | null) => void;
  _setIsExcessiveTimeAlertVisible: (visible: boolean) => void;
  _setIsExcessiveTimeAlertDismissed: (dismissed: boolean) => void;
  _setDismissedAt: (timestamp: number | null) => void;
}

export const ExcessiveTimeAlertContext = createContext<
  ExcessiveTimeAlertContextValue | undefined
>(undefined);

/**
 * Hook to access excessive time alert context
 * 
 * ⚠️ **Note**: This hook is for internal use by useExcessiveTimeAlert hook only.
 * Components should use useExcessiveTimeAlert() instead, which provides all business logic.
 * 
 * @throws Error if used outside ExcessiveTimeAlertProvider
 * 
 * @internal
 */
export function useExcessiveTimeAlertContext(): ExcessiveTimeAlertContextValue {
  const context = useContext(ExcessiveTimeAlertContext);
  
  if (!context) {
    throw new Error(
      "useExcessiveTimeAlertContext must be used within ExcessiveTimeAlertProvider"
    );
  }
  
  return context;
}
