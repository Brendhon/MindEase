import { useCallback } from "react";
import { useDialogContext, DialogConfig } from "@/contexts/dialog-context";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { generateRandomUUID } from "@/utils/uuid";

/**
 * useDialog Hook - MindEase
 * Centralized hook for managing dialogs
 * 
 * This hook encapsulates all business logic following Next.js best practices:
 * - Open dialog with configuration
 * - Close dialog
 * - Update dialog state
 * - Automatic ID generation
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * Features:
 * - Centralized dialog management
 * - Automatic translation support
 * - Flexible configuration
 * - Simple API
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { openDialog, closeDialog } = useDialog();
 *   
 *   const handleDelete = () => {
 *     openDialog({
 *       titleKey: "tasks_delete_confirm_title",
 *       descriptionKey: "tasks_delete_confirm_message",
 *       onConfirm: async () => {
 *         await deleteTask();
 *         closeDialog();
 *       },
 *       confirmVariant: "danger",
 *     });
 *   };
 *   
 *   return <button onClick={handleDelete}>Delete</button>;
 * }
 * ```
 */
export function useDialog() {
  const { dialog, _setDialog } = useDialogContext();

  /**
   * Open a dialog with the given configuration
   * Automatically generates a unique ID for the dialog
   */
  const openDialog = useCallback(
    (config: {
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
    }) => {
      _setDialog({
        ...config,
        id: generateRandomUUID(),
      });
    },
    [_setDialog]
  );

  /**
   * Close the current dialog
   */
  const closeDialog = useCallback(() => {
    _setDialog(null);
  }, [_setDialog]);

  /**
   * Update the current dialog configuration
   * Useful for updating loading state or other properties
   */
  const updateDialog = useCallback(
    (updates: Partial<DialogConfig>) => {
      _setDialog((prev) => (prev ? { ...prev, ...updates } : null));
    },
    [_setDialog]
  );

  return {
    // State
    dialog,

    // Operations
    openDialog,
    closeDialog,
    updateDialog,
  };
}
