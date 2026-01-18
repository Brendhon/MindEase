'use client';

import { BaseComponentProps } from '@/models/base';
import { cn } from '@/utils/ui';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import { styles } from './switch-styles';

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
export interface SwitchToggleProps extends BaseComponentProps {
  /** Current checked state */
  checked: boolean;

  /** Change handler */
  onChange: (checked: boolean) => void;

  /** Disable the switch */
  disabled?: boolean;
}

export function SwitchToggle({
  checked,
  onChange,
  disabled = false,
  'data-testid': testId,
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
      data-testid={testId || 'switch-toggle'}
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

SwitchToggle.displayName = 'Switch.Toggle';
