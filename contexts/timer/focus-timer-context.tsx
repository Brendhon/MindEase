import { createTimerContext } from "./create-timer-context";
import { FocusTimerContextValue } from "@/models/timer";

/**
 * Focus Timer Context - MindEase
 * Global timer state management
 * 
 * All business logic is handled by the FocusTimerProvider.
 * Components should use useFocusTimer() hook, not useFocusTimerContext().
 */

const { context: FocusTimerContext, useContext: useFocusTimerContextHook } =
  createTimerContext<FocusTimerContextValue>("FocusTimer");

export { FocusTimerContext };

/**
 * Hook to access focus timer context
 * 
 * ⚠️ **Note**: This hook is for internal use by useFocusTimer hook only.
 * Components should use useFocusTimer() instead.
 * 
 * @throws Error if used outside FocusTimerProvider
 * 
 * @internal
 */
export function useFocusTimerContext(): FocusTimerContextValue {
  return useFocusTimerContextHook();
}
