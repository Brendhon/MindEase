"use client";

import {
  CognitiveAlertsAction,
  CognitiveAlertsContext,
  CognitiveAlertsState,
  AlertType,
} from "@/contexts/cognitive-alerts-context";
import { MIN_ALERT_INTERVAL_MS } from "@/components/dashboard/dashboard-cognitive-alerts/cognitive-alerts-constants";
import { ReactNode, useCallback, useEffect, useMemo, useReducer } from "react";

/**
 * Cognitive Alerts Provider Props
 */
export interface CognitiveAlertsProviderProps {
  children: ReactNode;
}

/**
 * Storage key for persisting state
 */
const STORAGE_KEY = "mindease_cognitive_alerts_state";

/**
 * Create initial state
 */
function createInitialState(): CognitiveAlertsState {
  return {
    alertHistory: [],
    lastAlertTime: null,
    consecutiveSessions: 0,
    navigationStartTime: null,
    taskFocusTimes: {},
    lastUserAction: Date.now(),
  };
}

/**
 * Load state from sessionStorage
 */
function loadStateFromStorage(): CognitiveAlertsState | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Validate and restore state
    const state: CognitiveAlertsState = {
      alertHistory: Array.isArray(parsed.alertHistory) ? parsed.alertHistory : [],
      lastAlertTime: typeof parsed.lastAlertTime === "number" ? parsed.lastAlertTime : null,
      consecutiveSessions: typeof parsed.consecutiveSessions === "number" ? parsed.consecutiveSessions : 0,
      navigationStartTime: typeof parsed.navigationStartTime === "number" ? parsed.navigationStartTime : null,
      taskFocusTimes: typeof parsed.taskFocusTimes === "object" && parsed.taskFocusTimes !== null 
        ? parsed.taskFocusTimes 
        : {},
      lastUserAction: typeof parsed.lastUserAction === "number" ? parsed.lastUserAction : Date.now(),
    };
    
    // Check if session is from a different day (reset alert history)
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    if (state.lastAlertTime && (now - state.lastAlertTime) > oneDayInMs) {
      state.alertHistory = [];
      state.lastAlertTime = null;
    }
    
    return state;
  } catch (error) {
    console.error("Error loading cognitive alerts state from storage:", error);
    return null;
  }
}

/**
 * Save state to sessionStorage
 */
function saveStateToStorage(state: CognitiveAlertsState): void {
  if (typeof window === "undefined") return;
  
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cognitive alerts state to storage:", error);
  }
}

/**
 * Cognitive Alerts Reducer
 * Handles all state transitions
 */
function cognitiveAlertsReducer(
  state: CognitiveAlertsState,
  action: CognitiveAlertsAction
): CognitiveAlertsState {
  switch (action.type) {
    case "SHOW_ALERT":
      return {
        ...state,
        alertHistory: [...state.alertHistory, action.alertType],
        lastAlertTime: Date.now(),
      };
    
    case "DISMISS_ALERT":
      return {
        ...state,
        alertHistory: state.alertHistory.filter(type => type !== action.alertType),
      };
    
    case "INCREMENT_SESSIONS":
      return {
        ...state,
        consecutiveSessions: state.consecutiveSessions + 1,
      };
    
    case "RESET_SESSIONS":
      return {
        ...state,
        consecutiveSessions: 0,
      };
    
    case "START_NAVIGATION":
      return {
        ...state,
        navigationStartTime: state.navigationStartTime || Date.now(),
      };
    
    case "STOP_NAVIGATION":
      return {
        ...state,
        navigationStartTime: null,
      };
    
    case "START_TASK_FOCUS":
      return {
        ...state,
        taskFocusTimes: {
          ...state.taskFocusTimes,
          [action.taskId]: {
            startTime: Date.now(),
            totalTime: state.taskFocusTimes[action.taskId]?.totalTime || 0,
          },
        },
      };
    
    case "STOP_TASK_FOCUS": {
      const taskData = state.taskFocusTimes[action.taskId];
      if (!taskData) return state;
      
      const elapsed = Date.now() - taskData.startTime;
      return {
        ...state,
        taskFocusTimes: {
          ...state.taskFocusTimes,
          [action.taskId]: {
            startTime: 0,
            totalTime: taskData.totalTime + elapsed,
          },
        },
      };
    }
    
    case "UPDATE_USER_ACTION":
      return {
        ...state,
        lastUserAction: Date.now(),
        // Stop navigation tracking if user performed an action
        navigationStartTime: null,
      };
    
    case "RESET_SESSION":
      return {
        ...state,
        alertHistory: [],
        lastAlertTime: null,
      };
    
    default:
      return state;
  }
}

/**
 * Cognitive Alerts Provider Component - MindEase
 * Provides cognitive alerts context to children components
 * 
 * This provider manages all alert logic including:
 * - State management with useReducer
 * - Persistence to sessionStorage
 * - Frequency rules for alerts
 */
export function CognitiveAlertsProvider({
  children,
}: CognitiveAlertsProviderProps) {
  // Initialize state (load from sessionStorage if available)
  const [state, dispatch] = useReducer(
    cognitiveAlertsReducer,
    null,
    () => loadStateFromStorage() || createInitialState()
  );
  
  // Persist state when it changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);
  
  // Action handlers
  const showAlert = useCallback((alertType: AlertType) => {
    dispatch({ type: "SHOW_ALERT", alertType });
  }, []);
  
  const dismissAlert = useCallback((alertType: AlertType) => {
    dispatch({ type: "DISMISS_ALERT", alertType });
  }, []);
  
  const incrementSessions = useCallback(() => {
    dispatch({ type: "INCREMENT_SESSIONS" });
  }, []);
  
  const resetSessions = useCallback(() => {
    dispatch({ type: "RESET_SESSIONS" });
  }, []);
  
  const startNavigation = useCallback(() => {
    dispatch({ type: "START_NAVIGATION" });
  }, []);
  
  const stopNavigation = useCallback(() => {
    dispatch({ type: "STOP_NAVIGATION" });
  }, []);
  
  const startTaskFocus = useCallback((taskId: string) => {
    dispatch({ type: "START_TASK_FOCUS", taskId });
  }, []);
  
  const stopTaskFocus = useCallback((taskId: string) => {
    dispatch({ type: "STOP_TASK_FOCUS", taskId });
  }, []);
  
  const updateUserAction = useCallback(() => {
    dispatch({ type: "UPDATE_USER_ACTION" });
  }, []);
  
  const resetSession = useCallback(() => {
    dispatch({ type: "RESET_SESSION" });
  }, []);
  
  // Helper functions
  const shouldShowAlert = useCallback((alertType: AlertType): boolean => {
    const now = Date.now();
    const timeSinceLastAlert = state.lastAlertTime 
      ? now - state.lastAlertTime 
      : Infinity;
    
    // Não mostrar se já mostrou nos últimos 20-30 min (usando 20 min como padrão)
    if (timeSinceLastAlert < MIN_ALERT_INTERVAL_MS) return false;
    
    // Não repetir mesmo alerta na sessão
    if (state.alertHistory.includes(alertType)) return false;
    
    return true;
  }, [state.lastAlertTime, state.alertHistory]);
  
  const getTaskFocusTime = useCallback((taskId: string): number => {
    const taskData = state.taskFocusTimes[taskId];
    if (!taskData) return 0;
    
    // If task is currently being tracked (startTime > 0), add elapsed time
    if (taskData.startTime > 0) {
      const elapsed = Date.now() - taskData.startTime;
      return taskData.totalTime + elapsed;
    }
    
    return taskData.totalTime;
  }, [state.taskFocusTimes]);
  
  const getNavigationTime = useCallback((): number => {
    if (!state.navigationStartTime) return 0;
    return Date.now() - state.navigationStartTime;
  }, [state.navigationStartTime]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      showAlert,
      dismissAlert,
      incrementSessions,
      resetSessions,
      startNavigation,
      stopNavigation,
      startTaskFocus,
      stopTaskFocus,
      updateUserAction,
      resetSession,
      shouldShowAlert,
      getTaskFocusTime,
      getNavigationTime,
    }),
    [
      state,
      showAlert,
      dismissAlert,
      incrementSessions,
      resetSessions,
      startNavigation,
      stopNavigation,
      startTaskFocus,
      stopTaskFocus,
      updateUserAction,
      resetSession,
      shouldShowAlert,
      getTaskFocusTime,
      getNavigationTime,
    ]
  );
  
  return (
    <CognitiveAlertsContext.Provider value={contextValue}>
      {children}
    </CognitiveAlertsContext.Provider>
  );
}
