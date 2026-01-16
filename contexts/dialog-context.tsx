import { createContext, useContext } from "react";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";

/**
 * Dialog configuration
 */
export interface DialogConfig {
  id: string;
  titleKey: AccessibilityTextKey;
  descriptionKey: AccessibilityTextKey;
  info?: string | React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void | Promise<void>;
  cancelLabelKey?: AccessibilityTextKey;
  confirmLabelKey?: AccessibilityTextKey;
  confirmVariant?: "primary" | "secondary" | "ghost" | "danger" | "warning";
  preventClose?: boolean;
  isLoading?: boolean;
  "data-testid"?: string;
}

/**
 * Dialog Context - MindEase
 * Global dialog state management
 * 
 * This context provides ONLY basic state:
 * - Dialog configuration
 * - Internal setters for useDialog hook
 * 
 * All business logic (openDialog, closeDialog, updateDialog operations)
 * is handled by the useDialog hook. Components should use useDialog(), not useDialogContext().
 * 
 * Note: DialogManager component uses useDialogContext() directly for internal rendering.
 */
export interface DialogContextValue {
  /** Current dialog configuration */
  dialog: DialogConfig | null;

  // Internal setters - only used by useDialog hook and DialogManager
  _setDialog: (dialog: DialogConfig | null | ((prev: DialogConfig | null) => DialogConfig | null)) => void;
}

export const DialogContext = createContext<DialogContextValue | undefined>(
  undefined
);

/**
 * Hook to access dialog context
 * 
 * ⚠️ **Note**: This hook is for internal use by useDialog hook and DialogManager component only.
 * Components should use useDialog() instead, which provides all business logic.
 * 
 * @throws Error if used outside DialogProvider
 * 
 * @internal
 */
export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within DialogProvider");
  }
  return context;
}
