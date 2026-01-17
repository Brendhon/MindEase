/**
 * useActiveTaskIndicator Hook - MindEase
 * Encapsulates all business logic for ActiveTaskIndicator component
 * 
 * This hook handles:
 * - Monitoring focus and break timer states
 * - Determining which timer is active (prioritizing focus over break)
 * - Fetching active task data
 * - Calculating derived states
 * 
 * @example
 * ```tsx
 * function ActiveTaskIndicator() {
 *   const { activeTimer, activeTask, timerType, remainingTime } = useActiveTaskIndicator();
 *   
 *   if (!activeTimer) return null;
 *   
 *   return <div>...</div>;
 * }
 * ```
 */

"use client";

import { useBreakTimer } from "@/hooks/useBreakTimer";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/models/Task";
import { useMemo } from "react";

export type TimerType = "focus" | "break";

export interface ActiveTimer {
  type: TimerType;
  taskId: string | null;
  time: number;
}

export interface UseActiveTaskIndicatorReturn {
  /** Active timer object with type, taskId, and remaining time, or null */
  activeTimer: ActiveTimer | null;
  /** Active task object or null */
  activeTask: Task | null;
  /** Timer type: "focus" | "break" | null */
  timerType: TimerType | null;
  /** Remaining time in seconds */
  remainingTime: number;
}

/**
 * Hook for managing active task indicator business logic
 * @returns Active timer state, task data, and derived values
 */
export function useActiveTaskIndicator(): UseActiveTaskIndicatorReturn {
  const { timerState, hasActiveTask: hasFocusTask, remainingTime: focusTime } = useFocusTimer();
  const { breakTimerState, hasActiveTask: hasBreakTask, remainingTime: breakTime } = useBreakTimer();
  const { getTask } = useTasks();

  // Determine which timer is active (prioritize focus)
  const activeTimer = useMemo(() => {
    if (hasFocusTask && timerState.timerState === "running") {
      return {
        type: "focus" as const,
        taskId: timerState.activeTaskId,
        time: focusTime,
      };
    }
    if (hasBreakTask && breakTimerState.breakTimerState === "running") {
      return {
        type: "break" as const,
        taskId: breakTimerState.activeTaskId,
        time: breakTime,
      };
    }
    return null;
  }, [hasFocusTask, hasBreakTask, timerState, breakTimerState, focusTime, breakTime]);

  // Fetch task if there's a taskId
  const activeTask = useMemo(() => {
    if (!activeTimer?.taskId) return null;
    return getTask(activeTimer.taskId) || null;
  }, [activeTimer?.taskId, getTask]);

  return {
    activeTimer,
    activeTask,
    timerType: activeTimer?.type || null,
    remainingTime: activeTimer?.time || 0,
  };
}
