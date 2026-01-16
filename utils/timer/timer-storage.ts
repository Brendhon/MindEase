/**
 * Timer Storage - MindEase
 * Generic storage abstraction for timer state persistence
 * 
 * Provides a testable interface for localStorage operations.
 * Allows mocking in tests and handles errors gracefully.
 */

/**
 * Generic storage interface for timer state
 */
export interface TimerStorage<T> {
  get: () => T | null;
  set: (state: T) => void;
  remove: () => void;
}

/**
 * Create a timer storage instance for a specific key
 * 
 * @param storageKey - localStorage key to use
 * @param storageName - Name for error messages (e.g., "timer", "break timer")
 * @returns Storage instance with get, set, and remove methods
 * 
 * @example
 * const timerStorage = createTimerStorage<FocusTimerState>(
 *   "mindEase_focusTimer",
 *   "timer"
 * );
 */
export function createTimerStorage<T>(
  storageKey: string,
  storageName: string = "timer"
): TimerStorage<T> {
  return {
    get: (): T | null => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return null;
        return JSON.parse(saved) as T;
      } catch {
        return null;
      }
    },
    set: (state: T): void => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error(`Error saving ${storageName} state:`, error);
      }
    },
    remove: (): void => {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error(`Error removing ${storageName} state:`, error);
      }
    },
  };
}
