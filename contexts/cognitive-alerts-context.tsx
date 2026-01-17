import { createContext, useContext } from "react";

/**
 * Cognitive Alerts Context - MindEase
 * Global cognitive alerts state management
 * 
 * All business logic is handled by the CognitiveAlertsProvider.
 * Components should use useCognitiveAlerts() hook, not useCognitiveAlertsContext().
 */

/**
 * Types of cognitive alerts
 */
export type AlertType = 
  | "excessive_time" 
  | "missing_break" 
  | "prolonged_navigation" 
  | "visual_overload";

/**
 * Task focus time tracking data
 */
export interface TaskFocusTimeData {
  startTime: number;
  totalTime: number; // in milliseconds
}

/**
 * Cognitive Alerts State
 * Tracks all state related to cognitive alerts
 */
export interface CognitiveAlertsState {
  // Histórico de alertas mostrados na sessão atual
  alertHistory: AlertType[];
  
  // Timestamp do último alerta mostrado
  lastAlertTime: number | null;
  
  // Contador de sessões consecutivas sem pausa
  consecutiveSessions: number;
  
  // Timestamp de quando usuário começou a navegar sem ações
  navigationStartTime: number | null;
  
  // Rastreamento de tempo de foco por task (para alerta de tempo excessivo)
  taskFocusTimes: Record<string, TaskFocusTimeData>;
  
  // Última ação do usuário (para detectar navegação prolongada)
  lastUserAction: number | null;
}

/**
 * Cognitive Alerts Reducer Actions
 */
export type CognitiveAlertsAction =
  | { type: "SHOW_ALERT"; alertType: AlertType }
  | { type: "DISMISS_ALERT"; alertType: AlertType }
  | { type: "INCREMENT_SESSIONS" }
  | { type: "RESET_SESSIONS" }
  | { type: "START_NAVIGATION" }
  | { type: "STOP_NAVIGATION" }
  | { type: "START_TASK_FOCUS"; taskId: string }
  | { type: "STOP_TASK_FOCUS"; taskId: string }
  | { type: "UPDATE_USER_ACTION" }
  | { type: "RESET_SESSION" }; // Limpar histórico ao iniciar nova sessão

/**
 * Cognitive Alerts Context Value
 * Contains alert state and control functions
 */
export interface CognitiveAlertsContextValue {
  /** Current alert state */
  state: CognitiveAlertsState;
  
  /** Show an alert (adds to history and updates lastAlertTime) */
  showAlert: (alertType: AlertType) => void;
  
  /** Dismiss an alert (removes from history) */
  dismissAlert: (alertType: AlertType) => void;
  
  /** Increment consecutive sessions counter */
  incrementSessions: () => void;
  
  /** Reset consecutive sessions counter */
  resetSessions: () => void;
  
  /** Start tracking navigation time */
  startNavigation: () => void;
  
  /** Stop tracking navigation time */
  stopNavigation: () => void;
  
  /** Start tracking focus time for a task */
  startTaskFocus: (taskId: string) => void;
  
  /** Stop tracking focus time for a task */
  stopTaskFocus: (taskId: string) => void;
  
  /** Update last user action timestamp */
  updateUserAction: () => void;
  
  /** Reset session (clear alert history) */
  resetSession: () => void;
  
  /** Check if an alert should be shown (frequency rules) */
  shouldShowAlert: (alertType: AlertType) => boolean;
  
  /** Get total focus time for a task in milliseconds */
  getTaskFocusTime: (taskId: string) => number;
  
  /** Get navigation time in milliseconds */
  getNavigationTime: () => number;
}

export const CognitiveAlertsContext = createContext<CognitiveAlertsContextValue | undefined>(undefined);

/**
 * Hook to access cognitive alerts context
 * 
 * ⚠️ **Note**: This hook is for internal use by useCognitiveAlerts hook only.
 * Components should use useCognitiveAlerts() instead.
 * 
 * @throws Error if used outside CognitiveAlertsProvider
 * 
 * @internal
 */
export function useCognitiveAlertsContext(): CognitiveAlertsContextValue {
  const context = useContext(CognitiveAlertsContext);
  if (context === undefined) {
    throw new Error("useCognitiveAlertsContext must be used within CognitiveAlertsProvider");
  }
  return context;
}
