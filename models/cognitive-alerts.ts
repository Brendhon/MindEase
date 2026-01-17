/**
 * Cognitive Alerts Models - MindEase
 * 
 * Type definitions for cognitive alert contexts and related structures.
 */

/**
 * Base interface for all cognitive alert contexts.
 * All alert contexts extend this interface with their specific fields.
 */
export interface BaseAlertContextValue {
  /** Whether the alert is visible */
  isVisible: boolean;
  
  /** Whether the alert has been dismissed */
  isDismissed: boolean;
  
  /** Timestamp when alert was dismissed (in milliseconds) */
  dismissedAt: number | null;
  
  // Internal setters - only used by alert hooks
  /** Set alert visibility */
  _setIsVisible: (visible: boolean) => void;
  
  /** Set alert dismissed state */
  _setIsDismissed: (dismissed: boolean) => void;
  
  /** Set dismiss timestamp */
  _setDismissedAt: (timestamp: number | null) => void;
}

/**
 * Excessive Time Alert Context Value
 * 
 * Context for tracking continuous focus time on the same task.
 */
export interface ExcessiveTimeAlertContextValue {
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

/**
 * Missing Break Alert Context Value
 * 
 * Context for tracking consecutive focus sessions without breaks.
 */
export interface MissingBreakAlertContextValue {
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

/**
 * Prolonged Navigation Alert Context Value
 * 
 * Context for tracking navigation time without user actions.
 */
export interface ProlongedNavigationAlertContextValue {
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
