import { createAlertContext } from "./create-alert-context";
import { ProlongedNavigationAlertContextValue } from "@/models/cognitive-alerts";

/**
 * Prolonged Navigation Alert Context - MindEase
 * 
 * Context for tracking navigation time without user actions.
 * 
 * This context provides ONLY basic state:
 * - Navigation tracking timestamps
 * - Alert visibility states
 * - Internal setters for useProlongedNavigationAlert hook
 * 
 * All business logic (navigation tracking, alert rules, state management)
 * is handled by the useProlongedNavigationAlert hook. Components should use useProlongedNavigationAlert(), not useProlongedNavigationAlertContext().
 */

const { context: ProlongedNavigationAlertContext, useContext: useProlongedNavigationAlertContextHook } =
  createAlertContext<ProlongedNavigationAlertContextValue>("ProlongedNavigationAlert");

export { ProlongedNavigationAlertContext };

/**
 * Hook to access prolonged navigation alert context
 * 
 * ⚠️ **Note**: This hook is for internal use by useProlongedNavigationAlert hook only.
 * Components should use useProlongedNavigationAlert() instead, which provides all business logic.
 * 
 * @throws Error if used outside ProlongedNavigationAlertProvider
 * 
 * @internal
 */
export function useProlongedNavigationAlertContext(): ProlongedNavigationAlertContextValue {
  return useProlongedNavigationAlertContextHook();
}
