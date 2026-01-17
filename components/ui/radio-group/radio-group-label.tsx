"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";
import { cn } from "@/utils/ui";
import { Label } from "@headlessui/react";
import { useMemo } from "react";
import { useRadioGroupContext } from "./radio-group-context";
import { styles } from "./radio-group-styles";

/**
 * RadioGroup.Label - Label subcomponent
 * 
 * @example
 * ```tsx
 * <RadioGroup value={selected} onChange={setSelected}>
 *   <RadioGroup.Header>
 *     <RadioGroup.Label>Choose option</RadioGroup.Label>
 *   </RadioGroup.Header>
 *   <RadioGroup.Option value="option1" label="Option 1" />
 * </RadioGroup>
 * ```
 */
export interface RadioGroupLabelProps extends BaseComponentProps {
  /** Label text */
  children: string;
  
  /** HTML id attribute for accessibility (optional, uses context ID if not provided) */
  id?: string;
}

export function RadioGroupLabel({
  children,
  id: providedId,
  "data-testid": testId,
}: RadioGroupLabelProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const context = useRadioGroupContext();
  const id = providedId || context.labelId;

  const labelClasses = useMemo(
    () => cn(styles.label, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  return (
    <Label
      id={id}
      className={labelClasses}
      data-testid={testId || "radio-group-label"}
    >
      {children}
    </Label>
  );
}

RadioGroupLabel.displayName = "RadioGroup.Label";
