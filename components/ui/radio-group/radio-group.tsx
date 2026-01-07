"use client";

import { RadioGroup as HeadlessRadioGroup, Label } from "@headlessui/react";
import { useId, useMemo, ReactNode } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles } from "./radio-group-styles";

/**
 * RadioGroup Component - MindEase
 * Accessible radio group with cognitive accessibility features
 * 
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected} label="Choose option">
 *   <RadioGroup.Option value="option1">Option 1</RadioGroup.Option>
 *   <RadioGroup.Option value="option2">Option 2</RadioGroup.Option>
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
  const groupId = `radio-group-${id}`;
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
          <HeadlessRadioGroup.Label
            id={labelId}
            className={labelClasses}
            data-testid={testId ? `${testId}-label` : "radio-group-label"}
          >
            {label}
          </HeadlessRadioGroup.Label>
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

/**
 * RadioGroup.Option - Individual radio option
 */
export interface RadioOptionProps {
  /** Option value */
  value: string;
  
  /** Option label */
  label: string;
  
  /** Optional description */
  description?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

function RadioOption({ value, label, description, "data-testid": testId }: RadioOptionProps) {
  const { fontSizeClasses, spacingClasses } = useCognitiveSettings();

  const labelClasses = useMemo(
    () => cn(styles.optionLabel, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  const descriptionClasses = useMemo(
    () => cn(styles.optionDescription, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const optionClasses = useMemo(
    () => cn(styles.option, spacingClasses.padding),
    [spacingClasses.padding]
  );

  return (
    <HeadlessRadioGroup.Option
      value={value}
      className={({ checked, disabled }) =>
        cn(
          optionClasses,
          checked ? styles.optionChecked : styles.optionUnchecked,
          disabled && styles.optionDisabled,
          "focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-offset-2"
        )
      }
      data-testid={testId || `radio-option-${value}`}
    >
      {({ checked }) => (
        <>
          <div className={styles.optionContent}>
            <div className={cn(styles.radio, checked && styles.radioChecked)}>
              {checked && <div className={styles.radioDot} />}
            </div>
            <div className={styles.optionText}>
              <Label className={labelClasses}>
                {label}
              </Label>
              {description && (
                <p className={descriptionClasses}>{description}</p>
              )}
            </div>
          </div>
        </>
      )}
    </HeadlessRadioGroup.Option>
  );
}

RadioGroupRoot.Option = RadioOption;
RadioGroupRoot.displayName = "RadioGroup";
RadioOption.displayName = "RadioGroup.Option";

export const RadioGroup = RadioGroupRoot as typeof RadioGroupRoot & {
  Option: typeof RadioOption;
};

