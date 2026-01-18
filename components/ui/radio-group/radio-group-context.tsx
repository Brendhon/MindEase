'use client';

import { createContext, useContext } from 'react';

/**
 * RadioGroup Context
 * Provides IDs for Label and Description to subcomponents
 */
interface RadioGroupContextValue {
  labelId: string;
  descriptionId: string;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null
);

/**
 * Hook to access RadioGroup context
 * @throws Error if used outside RadioGroup
 */
export function useRadioGroupContext(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroup subcomponents must be used inside RadioGroup');
  }
  return context;
}
