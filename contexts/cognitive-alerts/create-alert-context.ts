import { createContext, useContext } from 'react';

/**
 * Creates a cognitive alert context with validation hook.
 *
 * This factory function generates:
 * - A React context for the alert
 * - A hook to access the context with error handling
 *
 * @param alertName - Name of the alert (e.g., "ExcessiveTimeAlert") for error messages
 * @returns Object containing the context and hook
 *
 * @example
 * ```typescript
 * const {
 *   context: ExcessiveTimeAlertContext,
 *   useContext: useExcessiveTimeAlertContext
 * } = createAlertContext<ExcessiveTimeAlertContextValue>("ExcessiveTimeAlert");
 * ```
 */
export function createAlertContext<T>(alertName: string) {
  const Context = createContext<T | undefined>(undefined);

  /**
   * Hook to access the alert context
   *
   * ⚠️ **Note**: This hook is for internal use by alert hooks only.
   * Components should use the public alert hook instead.
   *
   * @throws Error if used outside the corresponding Provider
   *
   * @internal
   */
  function useContextHook(): T {
    const context = useContext(Context);

    if (!context) {
      throw new Error(
        `use${alertName}Context must be used within ${alertName}Provider`
      );
    }

    return context;
  }

  return {
    context: Context,
    useContext: useContextHook,
  };
}
