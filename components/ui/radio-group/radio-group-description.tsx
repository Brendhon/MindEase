"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { useRadioGroupContext } from "./radio-group-context";
import { styles } from "./radio-group-styles";

/**
 * RadioGroup.Description - Description subcomponent
 * 
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected}>
 *   <RadioGroup.Header>
 *     <RadioGroup.Label>Choose option</RadioGroup.Label>
 *     <RadioGroup.Description>Select one of the options below</RadioGroup.Description>
 *   </RadioGroup.Header>
 *   <RadioGroup.Option value="option1" label="Option 1" />
 * </RadioGroup>
 * ```
 */
export interface RadioGroupDescriptionProps extends BaseComponentProps {
  /** Description text */
  children: string;
  
  /** HTML id attribute for accessibility (optional, uses context ID if not provided) */
  id?: string;
}

export function RadioGroupDescription({
  children,
  id: providedId,
  "data-testid": testId,
}: RadioGroupDescriptionProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const context = useRadioGroupContext();
  const id = providedId || context.descriptionId;

  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  return (
    <p
      id={id}
      className={descriptionClasses}
      data-testid={testId || "radio-group-description"}
    >
      {children}
    </p>
  );
}

RadioGroupDescription.displayName = "RadioGroup.Description";
