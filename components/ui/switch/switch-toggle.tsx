"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";
import { useMemo } from "react";
import { cn } from "@/utils/ui";
import { styles } from "./switch-styles";

/**
 * Switch.Toggle - Toggle switch visual component
 * 
 * @example
 * ```tsx
 * <Switch checked={enabled} onChange={setEnabled}>
 *   <Switch.Toggle />
 *   <Switch.Label>Enable notifications</Switch.Label>
 * </Switch>
 * ```
 */
export interface SwitchToggleProps {
  /** Current checked state */
  checked: boolean;
  
  /** Change handler */
  onChange: (checked: boolean) => void;
  
  /** Disable the switch */
  disabled?: boolean;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function SwitchToggle({
  checked,
  onChange,
  disabled = false,
  "data-testid": testId,
}: SwitchToggleProps) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        styles.switch,
        checked ? styles.switchChecked : styles.switchUnchecked,
        disabled && styles.switchDisabled
      )}
      data-testid={testId || "switch-toggle"}
    >
      <span
        className={cn(
          styles.thumb,
          checked ? styles.thumbChecked : styles.thumbUnchecked
        )}
        aria-hidden="true"
      />
    </HeadlessSwitch>
  );
}

SwitchToggle.displayName = "Switch.Toggle";
