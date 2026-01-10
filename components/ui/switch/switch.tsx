"use client";

import { useId, useMemo, ReactNode } from "react";
import { cn } from "@/utils/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { styles } from "./switch-styles";
import { SwitchToggle } from "./switch-toggle";
import { SwitchLabel } from "./switch-label";
import { SwitchDescription } from "./switch-description";

/**
 * Switch Component - MindEase
 * Accessible toggle switch with cognitive accessibility features
 * 
 * Supports both prop-based API (for simplicity) and composition API (for flexibility):
 * 
 * @example
 * ```tsx
 * // Prop-based API (recommended for simple cases)
 * <Switch
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Enable notifications"
 *   description="Receive email notifications"
 * />
 * 
 * // Composition API (for custom layouts)
 * <Switch checked={enabled} onChange={setEnabled}>
 *   <Switch.Toggle />
 *   <Switch.Label>Enable notifications</Switch.Label>
 *   <Switch.Description>Receive email notifications</Switch.Description>
 * </Switch>
 * ```
 */
export interface SwitchProps {
  /** Current checked state */
  checked: boolean;
  
  /** Change handler */
  onChange: (checked: boolean) => void;
  
  /** Label text (used when not using composition) */
  label?: string;
  
  /** Optional description text (used when not using composition) */
  description?: string;
  
  /** Disable the switch */
  disabled?: boolean;
  
  /** Custom className for container */
  className?: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
  
  /** Children (Switch subcomponents when using composition API) */
  children?: ReactNode;
}

function SwitchRoot({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  "data-testid": testId,
  children,
}: SwitchProps) {
  const id = useId();
  const descriptionId = description ? `switch-description-${id}` : undefined;

  // Use cognitive settings hook for automatic accessibility class generation
  const { spacingClasses } = useCognitiveSettings();

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap, className),
    [spacingClasses.gap, className]
  );

  // If children are provided, use composition API
  const useComposition = !!children;

  return (
    <div className={containerClasses} data-testid={testId || "switch-container"}>
      {useComposition ? (
        children
      ) : (
        <>
          <SwitchToggle
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            data-testid={testId ? `${testId}-switch` : undefined}
          />
          <div className={styles.content}>
            {label && (
              <SwitchLabel
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                data-testid={testId ? `${testId}-label` : undefined}
              >
                {label}
              </SwitchLabel>
            )}
            {description && (
              <SwitchDescription
                id={descriptionId}
                data-testid={testId ? `${testId}-description` : undefined}
              >
                {description}
              </SwitchDescription>
            )}
          </div>
        </>
      )}
    </div>
  );
}

SwitchRoot.displayName = "Switch";

// Compose Switch with subcomponents
export const Switch = Object.assign(SwitchRoot, {
  Toggle: SwitchToggle,
  Label: SwitchLabel,
  Description: SwitchDescription,
});

