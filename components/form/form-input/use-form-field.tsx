'use client';

import { useFormContext } from 'react-hook-form';

/**
 * Hook to get field state and error from react-hook-form context
 * Useful for building custom form components
 *
 * @example
 * ```tsx
 * function CustomFormField({ name }: { name: string }) {
 *   const { error, invalid } = useFormField(name);
 *
 *   return (
 *     <div>
 *       <input aria-invalid={invalid} />
 *       {error && <span>{error.message}</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFormField(name: string) {
  const {
    formState: { errors },
    getFieldState,
  } = useFormContext();

  const fieldState = getFieldState(name);
  const fieldError = errors[name];

  return {
    error: fieldError,
    invalid: fieldState.invalid,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
  };
}
