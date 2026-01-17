import { Task } from "./Task";

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
