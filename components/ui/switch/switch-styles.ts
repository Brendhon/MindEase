/**
 * Switch Styles - MindEase
 * Centralized styles for switch component
 */

export const styles = {
  container: 'flex items-start gap-3',
  switch:
    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  switchChecked: 'bg-action-primary',
  switchUnchecked: 'bg-surface-tertiary',
  switchDisabled: 'opacity-50 cursor-not-allowed',
  thumb:
    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
  thumbChecked: 'translate-x-5',
  thumbUnchecked: 'translate-x-0',
  content: 'flex flex-col',
  label: 'font-medium text-text-primary cursor-pointer',
  description: 'text-text-secondary mt-0.5',
} as const;
