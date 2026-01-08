"use client";

import { ReactNode } from "react";
import { FocusTimerProvider } from "@/contexts/focus-timer-context";

/**
 * Focus Timer Provider Wrapper - MindEase
 * Client component wrapper for FocusTimerProvider
 */
export interface FocusTimerProviderWrapperProps {
  children: ReactNode;
  onTaskStatusChange?: (taskId: string, status: number) => void;
}

export function FocusTimerProviderWrapper({
  children,
  onTaskStatusChange,
}: FocusTimerProviderWrapperProps) {
  return (
    <FocusTimerProvider onTaskStatusChange={onTaskStatusChange}>
      {children}
    </FocusTimerProvider>
  );
}
