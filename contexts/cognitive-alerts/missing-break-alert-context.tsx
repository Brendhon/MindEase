import { createAlertContext } from "./create-alert-context";
import { MissingBreakAlertContextValue } from "@/models/cognitive-alerts";

/**
 * Missing Break Alert Context - MindEase
 * 
 * Context for tracking consecutive focus sessions without breaks.
 * 
 * This context provides ONLY basic state:
 * - Session tracking counters
 * - Alert visibility states
 * - Internal setters for useMissingBreakAlert hook
 * 
 * All business logic (session tracking, alert rules, state management)
 * is handled by the useMissingBreakAlert hook. Components should use useMissingBreakAlert(), not useMissingBreakAlertContext().
 */

const { context: MissingBreakAlertContext, useContext: useMissingBreakAlertContextHook } =
  createAlertContext<MissingBreakAlertContextValue>("MissingBreakAlert");

export { MissingBreakAlertContext };

/**
 * Hook to access missing break alert context
 * 
 * ⚠️ **Note**: This hook is for internal use by useMissingBreakAlert hook only.
 * Components should use useMissingBreakAlert() instead, which provides all business logic.
 * 
 * @throws Error if used outside MissingBreakAlertProvider
 * 
 * @internal
 */
export function useMissingBreakAlertContext(): MissingBreakAlertContextValue {
  return useMissingBreakAlertContextHook();
}
