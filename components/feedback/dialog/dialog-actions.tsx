"use client";

import { Button } from "@/components/ui/button";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { styles } from "./dialog-manager-styles";

/**
 * Dialog.Actions - Actions subcomponent
 * Displays action buttons (cancel, confirm, or ok) in the dialog
 * 
 * @example
 * ```tsx
 * <DialogManager>
 *   <Dialog.Message messageKey="dialog_confirm_delete" />
 *   <Dialog.Actions
 *     onCancel={handleCancel}
 *     onConfirm={handleConfirm}
 *     isLoading={isLoading}
 *   />
 * </DialogManager>
 * ```
 */
export interface DialogActionsProps {
  onCancel?: () => void;
  onConfirm?: () => void | Promise<void>;
  cancelLabelKey?: AccessibilityTextKey;
  confirmLabelKey?: AccessibilityTextKey;
  confirmVariant?: "primary" | "secondary" | "ghost" | "danger" | "warning";
  isLoading?: boolean;
  onClose?: () => void;
  "data-testid"?: string;
}

export function DialogActions({
  onCancel,
  onConfirm,
  cancelLabelKey = "button_cancel",
  confirmLabelKey = "button_save",
  confirmVariant = "primary",
  isLoading = false,
  onClose,
  "data-testid": testId = "dialog",
}: DialogActionsProps) {
  const { spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  const actionsClasses = cn(styles.actions, spacingClasses.gap);

  // If no actions provided, show OK button
  if (!onCancel && !onConfirm) {
    return (
      <div className={actionsClasses} data-testid={testId ? `${testId}-actions` : "dialog-actions"}>
        <Button
          variant="primary"
          onClick={onClose}
          data-testid={`${testId}-ok`}
        >
          <Button.Text>{getText(confirmLabelKey)}</Button.Text>
        </Button>
      </div>
    );
  }

  return (
    <div className={actionsClasses} data-testid={testId ? `${testId}-actions` : "dialog-actions"}>
      {onCancel && (
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          data-testid={`${testId}-cancel`}
        >
          <Button.Text>{getText(cancelLabelKey)}</Button.Text>
        </Button>
      )}
      {onConfirm && (
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          data-testid={`${testId}-confirm`}
        >
          {isLoading && <Button.Loading />}
          <Button.Text>
            {isLoading
              ? getText("loading")
              : getText(confirmLabelKey)}
          </Button.Text>
        </Button>
      )}
    </div>
  );
}

DialogActions.displayName = "Dialog.Actions";
