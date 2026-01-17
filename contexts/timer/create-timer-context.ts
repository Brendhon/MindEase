import { createContext, useContext } from "react";

/**
 * Creates a timer context with validation hook.
 * 
 * This factory function generates:
 * - A React context for the timer
 * - A hook to access the context with error handling
 * 
 * @param timerName - Name of the timer (e.g., "BreakTimer", "FocusTimer") for error messages
 * @returns Object containing the context and hook
 * 
 * @example
 * ```typescript
 * const {
 *   context: BreakTimerContext,
 *   useContext: useBreakTimerContext
 * } = createTimerContext<BreakTimerContextValue>("BreakTimer");
 * ```
 */
export function createTimerContext<T>(
  timerName: string
) {
  const Context = createContext<T | undefined>(undefined);

  /**
   * Hook to access the timer context
   * 
   * ⚠️ **Note**: This hook is for internal use by timer hooks only.
   * Components should use the public timer hook instead.
   * 
   * @throws Error if used outside the corresponding Provider
   * 
   * @internal
   */
  function useContextHook(): T {
    const context = useContext(Context);
    
    if (!context) {
      throw new Error(
        `use${timerName}Context must be used within ${timerName}Provider`
      );
    }
    
    return context;
  }

  return {
    context: Context,
    useContext: useContextHook,
  };
}
