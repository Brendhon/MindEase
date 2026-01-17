import { createAlertContext } from "./create-alert-context";
import { ExcessiveTimeAlertContextValue } from "@/models/cognitive-alerts";

/**
 * Excessive Time Alert Context - MindEase
 * 
 * Context for tracking continuous focus time on the same task.
 * 
 * This context provides ONLY basic state:
 * - Task tracking (current task in focus and start timestamp)
 * - Alert visibility states
 * - Internal setters for useExcessiveTimeAlert hook
 * 
 * All business logic (time tracking, alert rules, state management)
 * is handled by the useExcessiveTimeAlert hook. Components should use useExcessiveTimeAlert(), not useExcessiveTimeAlertContext().
 */

const { context: ExcessiveTimeAlertContext, useContext: useExcessiveTimeAlertContextHook } =
  createAlertContext<ExcessiveTimeAlertContextValue>("ExcessiveTimeAlert");

export { ExcessiveTimeAlertContext };

/**
 * Hook to access excessive time alert context
 * 
 * ⚠️ **Note**: This hook is for internal use by useExcessiveTimeAlert hook only.
 * Components should use useExcessiveTimeAlert() instead, which provides all business logic.
 * 
 * @throws Error if used outside ExcessiveTimeAlertProvider
 * 
 * @internal
 */
export function useExcessiveTimeAlertContext(): ExcessiveTimeAlertContextValue {
  return useExcessiveTimeAlertContextHook();
}
