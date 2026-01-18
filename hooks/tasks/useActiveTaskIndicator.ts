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

import { useBreakTimer, useFocusTimer } from "@/hooks/timer";
import { useTasks } from "@/hooks/tasks";
import { TimerType, UseActiveTaskIndicatorReturn } from "@/models/timer";
import { useMemo } from "react";

/**
 * Hook for managing active task indicator business logic
 * @returns Active timer state, task data, and derived values
 */
export function useActiveTaskIndicator(): UseActiveTaskIndicatorReturn {
  const { timerState, isRunning: isFocusRunning, remainingTime: focusTime } = useFocusTimer();
  const { breakTimerState, isRunning: isBreakRunning, remainingTime: breakTime } = useBreakTimer();
  const { getTask } = useTasks();

  // Determine which timer is active (prioritize focus)
  const activeTimer = useMemo(() => {
    if (isFocusRunning()) {
      return {
        type: "focus" as TimerType,
        taskId: timerState.activeTaskId,
        time: focusTime,
      };
    }
    if (isBreakRunning()) {
      return {
        type: "break" as TimerType,
        taskId: breakTimerState.activeTaskId,
        time: breakTime,
      };
    }
    return null;
  }, [isFocusRunning, isBreakRunning, timerState, breakTimerState, focusTime, breakTime]);

  // Fetch task if there's a taskId
  const activeTask = useMemo(() => {
    if (!activeTimer?.taskId) return null;
    return getTask(activeTimer.taskId);
  }, [activeTimer, getTask]);

  return {
    activeTimer,
    activeTask: activeTask || null,
    timerType: activeTimer?.type || null,
    remainingTime: activeTimer?.time || 0,
  };
}
