"use client";

import { ReactNode, SelectHTMLAttributes, forwardRef, useMemo } from "react";
import { Select as HeadlessSelect } from "@headlessui/react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles, getContrastClasses } from "./select-styles";

/**
 * Select.Field - Select field subcomponent
 * Use this for the actual select element
 * Built on top of Headless UI Select for enhanced accessibility
 * 
 * @example
 * ```tsx
 * <Select>
 *   <Select.Label htmlFor="country">Country</Select.Label>
 *   <Select.Field id="country">
 *     <option value="">Select a country</option>
 *     <option value="br">Brazil</option>
 *   </Select.Field>
 * </Select>
 * ```
 */
export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

const SelectFieldRoot = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className = "", ...props }, ref) => {
    const isDisabled = props.disabled;
    const isInvalid = props["aria-invalid"] === true;

    // Use cognitive settings hook for automatic accessibility class generation
    // These classes automatically update when user preferences change
    const { 
      settings, 
      fontSizeClasses, // Recalculates when settings.fontSize changes
      spacingClasses, // Recalculates when settings.spacing changes
      animationClasses, // Recalculates when settings.animations changes
    } = useCognitiveSettings();

    // Generate contrast classes with select-specific logic
    const contrastClasses = useMemo(
      () => getContrastClasses(settings.contrast),
      [settings.contrast]
    );

    // Get fontSize class (use base for selects)
    const fontSizeClass = fontSizeClasses.base;

    // Get horizontal padding from spacing preference (convert p-X to px-X)
    const paddingClass = useMemo(() => {
      const paddingValue = spacingClasses.padding.replace('p-', '');
      return `px-${paddingValue}`;
    }, [spacingClasses.padding]);

    return (
      <HeadlessSelect
        ref={ref}
        invalid={isInvalid}
        className={cn(
          styles.field.base,
          styles.field.select,
          fontSizeClass, // Dynamically updates based on settings.fontSize
          paddingClass, // Dynamically updates based on settings.spacing (horizontal padding)
          animationClasses, // Dynamically updates based on settings.animations
          contrastClasses.base, // Contrast border
          contrastClasses.focus, // High contrast focus styles
          isDisabled && styles.field.disabled,
          className
        )}
        {...props}
      />
    );
  }
);

SelectFieldRoot.displayName = "Select.Field";

export const SelectField = SelectFieldRoot;
