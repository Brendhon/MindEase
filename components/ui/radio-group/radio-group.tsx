"use client";

import { RadioGroup as HeadlessRadioGroup, Label } from "@headlessui/react";
import { useId, useMemo, ReactNode } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles } from "./radio-group-styles";
import { RadioOption } from "./radio-group-option";

/**
 * RadioGroup Component - MindEase
 * Accessible radio group with cognitive accessibility features
 * 
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected} label="Choose option">
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
  
  /** Label text */
  label: string;
  
  /** Optional description text */
  description?: string;
  
  /** Radio options */
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
  label,
  description,
  children,
  disabled = false,
  className,
  "data-testid": testId,
}: RadioGroupProps<T>) {
  const id = useId();
  const labelId = `radio-group-label-${id}`;
  const descriptionId = description ? `radio-group-description-${id}` : undefined;

  // Use cognitive settings hook for automatic accessibility class generation
  const { fontSizeClasses, spacingClasses } = useCognitiveSettings();

  // Generate label classes with fontSize preference
  const labelClasses = useMemo(
    () => cn(styles.label, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

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

  return (
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
        <div className={styles.header}>
          <Label
            id={labelId}
            className={labelClasses}
            data-testid={testId ? `${testId}-label` : "radio-group-label"}
          >
            {label}
          </Label>
          {description && (
            <p
              id={descriptionId}
              className={descriptionClasses}
              data-testid={testId ? `${testId}-description` : "radio-group-description"}
            >
              {description}
            </p>
          )}
        </div>
        {children}
      </HeadlessRadioGroup>
    </div>
  );
}

RadioGroupRoot.displayName = "RadioGroup";

// Compose RadioGroup with subcomponents
export const RadioGroup = Object.assign(RadioGroupRoot, {
  Option: RadioOption,
});

