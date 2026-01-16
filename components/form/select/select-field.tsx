"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { Select as HeadlessSelect } from "@headlessui/react";
import { ReactNode, SelectHTMLAttributes, forwardRef, useMemo } from "react";
import { getContrastClasses, styles } from "./select-styles";

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

    // Use accessibility classes hook for optimized class generation
    // Only re-renders when relevant settings change
    const { 
      fontSizeClasses, // Recalculates only when settings.fontSize changes
      spacingClasses, // Recalculates only when settings.spacing changes
      animationClasses, // Recalculates only when settings.animations changes
    } = useAccessibilityClasses();
    
    // Get contrast setting directly from (only re-renders when contrast changes)
    const { settings } = useCognitiveSettings();

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
