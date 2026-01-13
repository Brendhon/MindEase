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

interface DialogContextValue {
  dialog: DialogConfig | null;
  openDialog: (config: Omit<DialogConfig, "id">) => void;
  closeDialog: () => void;
  updateDialog: (updates: Partial<DialogConfig>) => void;
}

export const DialogContext = createContext<DialogContextValue | undefined>(
  undefined
);

/**
 * Hook to access dialog context
 * @throws Error if used outside DialogProvider
 */
export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within DialogProvider");
  }
  return context;
}
