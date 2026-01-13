"use client";

import { useDialogContext } from "@/contexts/dialog-context";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { useCallback } from "react";

/**
 * Hook to show dialogs with a simple API
 *
 * Features:
 * - Centralized dialog management
 * - Automatic translation support
 * - Flexible configuration
 * - Simple API
 *
 * @example
 * ```tsx
 * const { openDialog } = useDialog();
 *
 * openDialog({
 *   titleKey: "tasks_delete_confirm_title",
 *   descriptionKey: "tasks_delete_confirm_message",
 *   onConfirm: () => handleDelete(),
 *   confirmVariant: "danger",
 * });
 * ```
 */
export function useDialog() {
  const context = useDialogContext();

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
      context.openDialog(config);
    },
    [context]
  );

  return {
    openDialog,
    closeDialog: context.closeDialog,
  };
}
