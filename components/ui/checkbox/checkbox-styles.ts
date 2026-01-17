/**
 * Checkbox Styles - MindEase
 * Centralized styles for checkbox component
 * Optimized for accessibility and contrast (WCAG 2.1 AA compliance)
 */

export const styles = {
  container: "flex items-center gap-2",
  checkbox: "flex items-center justify-center w-5 h-5 border-2 rounded flex-shrink-0 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-offset-2 focus:ring-offset-surface-primary disabled:cursor-not-allowed disabled:opacity-50",
  checkboxChecked: "bg-feedback-success border-feedback-success",
  checkboxUnchecked: "bg-surface-primary border-border-strong",
  checkboxDisabled: "opacity-50 cursor-not-allowed",
  checkboxIcon: "text-text-inverse stroke-[3]",
  content: "flex flex-col",
  label: "text-text-primary cursor-pointer font-medium truncate max-w-64",
  labelChecked: "line-through text-text-secondary",
  description: "text-text-secondary mt-0.5",
} as const;
