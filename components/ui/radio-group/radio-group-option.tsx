"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { cn } from "@/utils/ui";
import { Label, Radio } from "@headlessui/react";
import { useMemo } from "react";
import { styles } from "./radio-group-styles";

/**
 * RadioGroup.Option - Individual radio option
 * 
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected}>
 *   <RadioGroup.Header>
 *     <RadioGroup.Label>Choose option</RadioGroup.Label>
 *   </RadioGroup.Header>
 *   <RadioGroup.Option value="option1" label="Option 1" />
 *   <RadioGroup.Option value="option2" label="Option 2" description="Description" />
 * </RadioGroup>
 * ```
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

export function RadioOption({ value, label, description, "data-testid": testId }: RadioOptionProps) {
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();

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
    <Radio
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
    </Radio>
  );
}

RadioOption.displayName = "RadioGroup.Option";
