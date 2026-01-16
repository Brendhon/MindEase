/**
 * Timer State - MindEase
 * Base types and state creation helpers for timers
 */

/**
 * Base timer state structure
 * All timers share this common structure
 */
export interface BaseTimerState {
  activeTaskId: string | null;
  remainingTime: number; // in seconds
  startTime: Date | null;
}

/**
 * Create initial timer state (idle state)
 * 
 * @param defaultDuration - Default duration in seconds
 * @param stateField - Field name for the state type (e.g., "timerState", "breakTimerState")
 * @param idleState - Idle state value (e.g., "idle")
 * @returns Initial timer state
 */
export function createInitialTimerState<T extends BaseTimerState>(
  defaultDuration: number,
  stateField: keyof T,
  idleState: string
): T {
  return {
    activeTaskId: null,
    [stateField]: idleState,
    remainingTime: defaultDuration,
    startTime: null,
  } as unknown as T;
}

/**
 * Create running timer state
 * 
 * @param duration - Duration in seconds
 * @param stateField - Field name for the state type
 * @param runningState - Running state value (e.g., "running")
 * @param taskId - Task ID (optional, will be null if not provided)
 * @returns Running timer state
 */
export function createRunningTimerState<T extends BaseTimerState>(
  duration: number,
  stateField: keyof T,
  runningState: string,
  taskId?: string
): T {
  return {
    activeTaskId: taskId || null,
    [stateField]: runningState,
    remainingTime: duration,
    startTime: new Date(),
  } as unknown as T;
}

/**
 * Create idle timer state
 * 
 * @param defaultDuration - Default duration in seconds
 * @param stateField - Field name for the state type
 * @param idleState - Idle state value (e.g., "idle")
 * @returns Idle timer state
 */
export function createIdleTimerState<T extends BaseTimerState>(
  defaultDuration: number,
  stateField: keyof T,
  idleState: string
): T {
  return {
    activeTaskId: null,
    [stateField]: idleState,
    remainingTime: defaultDuration,
    startTime: null,
  } as unknown as T;
}

/**
 * Helper to create a completed state preserving activeTaskId
 * Used when timer completes and we need to preserve taskId for dialog detection
 * 
 * @param activeTaskId - Task ID to preserve (can be null)
 * @param defaultDuration - Default duration in seconds
 * @param stateField - Field name for the state type (e.g., "timerState", "breakTimerState")
 * @param completedState - State value when completed (e.g., "idle", "breakEnded")
 * @returns Completed timer state
 */
export function createCompletedTimerState<T extends BaseTimerState>(
  activeTaskId: string | null,
  defaultDuration: number,
  stateField: keyof T,
  completedState: string
): T {
  return {
    activeTaskId,
    [stateField]: completedState,
    remainingTime: defaultDuration,
    startTime: null,
  } as unknown as T;
}

/**
 * Create break ended state (specific to break timer)
 * 
 * @param defaultDuration - Default duration in seconds (not used, but kept for consistency)
 * @param stateField - Field name for the state type
 * @param breakEndedState - Break ended state value (e.g., "breakEnded")
 * @param taskId - Task ID to preserve (can be null)
 * @returns Break ended timer state
 */
export function createBreakEndedTimerState<T extends BaseTimerState>(
  defaultDuration: number,
  stateField: keyof T,
  breakEndedState: string,
  taskId?: string | null
): T {
  return {
    activeTaskId: taskId || null,
    [stateField]: breakEndedState,
    remainingTime: 0,
    startTime: null,
  } as unknown as T;
}
