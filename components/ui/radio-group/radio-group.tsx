"use client";

import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { useId, useMemo, ReactNode } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles } from "./radio-group-styles";
import { RadioOption } from "./radio-group-option";
import { RadioGroupLabel } from "./radio-group-label";
import { RadioGroupDescription } from "./radio-group-description";
import { RadioGroupHeader } from "./radio-group-header";
import { RadioGroupContext } from "./radio-group-context";

/**
 * RadioGroup Component - MindEase
 * Accessible radio group with cognitive accessibility features
 * 
 * Uses composition pattern exclusively - only accepts RadioGroup subcomponents:
 * - RadioGroup.Header for label and description wrapper
 * - RadioGroup.Label for the group label
 * - RadioGroup.Description for optional description
 * - RadioGroup.Option for individual radio options
 * 
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected}>
 *   <RadioGroup.Header>
 *     <RadioGroup.Label>Choose option</RadioGroup.Label>
 *     <RadioGroup.Description>Select one option</RadioGroup.Description>
 *   </RadioGroup.Header>
 *   <RadioGroup.Option value="option1" label="Option 1" />
 *   <RadioGroup.Option value="option2" label="Option 2" />
 * </RadioGroup>
 * ```
 */
export interface RadioGroupProps<T extends string> {
  /** Current selected value */
  value: T;
  
  /** Change handler */
  onChange: (value: T) => void;
  
  /** Radio group content (RadioGroup subcomponents) */
  children: ReactNode;
  
  /** Disable the radio group */
  disabled?: boolean;
  
  /** Custom className for container */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

function RadioGroupRoot<T extends string>({
  value,
  onChange,
  children,
  disabled = false,
  className,
  "data-testid": testId,
}: RadioGroupProps<T>) {
  const id = useId();
  const labelId = `radio-group-label-${id}`;
  const descriptionId = `radio-group-description-${id}`;

  // Use cognitive settings hook for automatic accessibility class generation
  const { spacingClasses } = useCognitiveSettings();

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap, className),
    [spacingClasses.gap, className]
  );

  // Generate options container classes with spacing preference
  const optionsClasses = useMemo(
    () => cn(styles.options, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Provide context to subcomponents
  const contextValue = useMemo(
    () => ({ labelId, descriptionId }),
    [labelId, descriptionId]
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={containerClasses} data-testid={testId || "radio-group-container"}>
        <HeadlessRadioGroup
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={optionsClasses}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          data-testid={testId ? `${testId}-group` : "radio-group"}
        >
          {children}
        </HeadlessRadioGroup>
      </div>
    </RadioGroupContext.Provider>
  );
}

RadioGroupRoot.displayName = "RadioGroup";

// Compose RadioGroup with subcomponents
export const RadioGroup = Object.assign(RadioGroupRoot, {
  Option: RadioOption,
  Header: RadioGroupHeader,
  Label: RadioGroupLabel,
  Description: RadioGroupDescription,
});

