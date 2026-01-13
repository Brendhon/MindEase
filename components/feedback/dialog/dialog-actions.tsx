"use client";

import { Button } from "@/components/ui/button";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
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
  cancelLabelKey,
  confirmLabelKey,
  confirmVariant = "primary",
  isLoading = false,
  onClose,
  "data-testid": testId = "dialog",
}: DialogActionsProps) {
  const { textDetail, spacingClasses } = useCognitiveSettings();

  const cancelLabel = cancelLabelKey
    ? textDetail.getText(cancelLabelKey)
    : textDetail.getText("button_cancel" as any);

  const confirmLabel = confirmLabelKey
    ? textDetail.getText(confirmLabelKey)
    : textDetail.getText("button_save" as any);

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
          <Button.Text>{textDetail.getText("button_save" as any)}</Button.Text>
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
          <Button.Text>{cancelLabel}</Button.Text>
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
              ? textDetail.getText("loading" as any)
              : confirmLabel}
          </Button.Text>
        </Button>
      )}
    </div>
  );
}

DialogActions.displayName = "Dialog.Actions";
