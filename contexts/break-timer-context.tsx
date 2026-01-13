"use client";

import { createContext, useContext, ReactNode } from "react";
import type { BreakTimerContextValue } from "@/hooks/useBreakTimer";
import { useBreakTimer as useBreakTimerHook } from "@/hooks/useBreakTimer";

/**
 * Break Timer Context - MindEase
 * Global break timer management for Pomodoro sessions
 * 
 * Features:
 * - Single active break timer per session
 * - Timer state persistence across page navigation
 * - Simple state: idle, running, or breakEnded
 * - No task association (break is global)
 */

// Re-export types from hook for convenience
export type { BreakTimerState, BreakTimerStateType, BreakTimerContextValue } from "@/hooks/useBreakTimer";

const BreakTimerContext = createContext<BreakTimerContextValue | undefined>(undefined);

/**
 * Break Timer Provider Props
 */
export interface BreakTimerProviderProps {
  children: ReactNode;
}

/**
 * Break Timer Provider Component
 * Wraps children with break timer context using the useBreakTimer hook
 */
export function BreakTimerProvider({ children }: BreakTimerProviderProps) {
  const timerValue = useBreakTimerHook();

  return (
    <BreakTimerContext.Provider value={timerValue}>
      {children}
    </BreakTimerContext.Provider>
  );
}

/**
 * Hook to access break timer context
 */
export function useBreakTimer(): BreakTimerContextValue {
  const context = useContext(BreakTimerContext);
  if (context === undefined) {
    throw new Error("useBreakTimer must be used within BreakTimerProvider");
  }
  return context;
}
