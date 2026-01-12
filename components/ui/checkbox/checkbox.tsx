"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { Button as HeadlessButton } from "@headlessui/react";
import { Check } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { styles } from "./checkbox-styles";
import { CheckboxLabel } from "./checkbox-label";
import { CheckboxDescription } from "./checkbox-description";

/**
 * Checkbox Component - MindEase
 * Accessible checkbox with cognitive accessibility features
 * 
 * Supports both prop-based API (for simplicity) and composition API (for flexibility):
 * 
 * @example
 * ```tsx
 * // Prop-based API (recommended for simple cases)
 * <Checkbox
 *   checked={completed}
 *   onChange={setCompleted}
 *   label="Complete task"
 *   description="Mark this task as completed"
 * />
 * 
 * // Composition API (for custom layouts)
 * <Checkbox checked={completed} onChange={setCompleted}>
 *   <Checkbox.Label>Complete task</Checkbox.Label>
 *   <Checkbox.Description>Mark this task as completed</Checkbox.Description>
 * </Checkbox>
 * ```
 */
export interface CheckboxProps {
  /** Current checked state */
  checked: boolean;
  
  /** Change handler */
  onChange: (checked: boolean) => void;
  
  /** Disable the checkbox */
  disabled?: boolean;
  
  /** Checkbox content (Checkbox subcomponents when using composition API) */
  children?: ReactNode;
  
  /** Custom className for container */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
  
  /** ARIA label for accessibility */
  "aria-label"?: string;
}

function CheckboxRoot({
  checked,
  onChange,
  disabled = false,
  children,
  className,
  "data-testid": testId,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  const { spacingClasses } = useCognitiveSettings();

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap, className),
    [spacingClasses.gap, className]
  );

  // Generate checkbox classes
  const checkboxClasses = useMemo(
    () => cn(
      styles.checkbox,
      checked ? styles.checkboxChecked : styles.checkboxUnchecked,
      disabled && styles.checkboxDisabled
    ),
    [checked, disabled]
  );

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={containerClasses} data-testid={testId || "checkbox-container"}>
      <HeadlessButton
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={checkboxClasses}
        data-testid={testId ? `${testId}-checkbox` : "checkbox"}
      >
        {checked && <Check size={14} className={styles.checkboxIcon} />}
      </HeadlessButton>
      {children && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
}

CheckboxRoot.displayName = "Checkbox";

// Compose Checkbox with subcomponents
export const Checkbox = Object.assign(CheckboxRoot, {
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
