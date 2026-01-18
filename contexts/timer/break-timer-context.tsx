import { createTimerContext } from './create-timer-context';
import { BreakTimerContextValue } from '@/models/timer';

/**
 * Break Timer Context - MindEase
 * Global break timer state management
 *
 * All business logic is handled by the BreakTimerProvider.
 * Components should use useBreakTimer() hook, not useBreakTimerContext().
 */

const { context: BreakTimerContext, useContext: useBreakTimerContextHook } =
  createTimerContext<BreakTimerContextValue>('BreakTimer');

export { BreakTimerContext };

/**
 * Hook to access break timer context
 *
 * ⚠️ **Note**: This hook is for internal use by useBreakTimer hook only.
 * Components should use useBreakTimer() instead.
 *
 * @throws Error if used outside BreakTimerProvider
 *
 * @internal
 */
export function useBreakTimerContext(): BreakTimerContextValue {
  return useBreakTimerContextHook();
}
