"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";
import { useId, useMemo } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles } from "./switch-styles";

/**
 * Switch Component - MindEase
 * Accessible toggle switch with cognitive accessibility features
 * 
 * @example
 * ```tsx
 * <Switch
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Enable notifications"
 *   description="Receive email notifications"
 * />
 * ```
 */
export interface SwitchProps {
  /** Current checked state */
  checked: boolean;
  
  /** Change handler */
  onChange: (checked: boolean) => void;
  
  /** Label text */
  label: string;
  
  /** Optional description text */
  description?: string;
  
  /** Disable the switch */
  disabled?: boolean;
  
  /** Custom className for container */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  "data-testid": testId,
}: SwitchProps) {
  const id = useId();
  const descriptionId = description ? `switch-description-${id}` : undefined;

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

  return (
    <div className={containerClasses} data-testid={testId || "switch-container"}>
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          styles.switch,
          checked ? styles.switchChecked : styles.switchUnchecked,
          disabled && styles.switchDisabled
        )}
        data-testid={testId ? `${testId}-switch` : "switch-toggle"}
      >
        <span
          className={cn(
            styles.thumb,
            checked ? styles.thumbChecked : styles.thumbUnchecked
          )}
          aria-hidden="true"
        />
      </HeadlessSwitch>

      <div className={styles.content}>
        <label
          className={labelClasses}
          onClick={() => !disabled && onChange(!checked)}
          data-testid={testId ? `${testId}-label` : "switch-label"}
        >
          {label}
        </label>
        {description && (
          <p
            id={descriptionId}
            className={descriptionClasses}
            data-testid={testId ? `${testId}-description` : "switch-description"}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

Switch.displayName = "Switch";

