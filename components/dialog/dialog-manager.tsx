"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDialogContext } from "@/contexts/dialog-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";

/**
 * DialogManager Component - MindEase
 * Renders the active dialog from the dialog context
 */
export function DialogManager() {
  const { dialog, closeDialog, updateDialog } = useDialogContext();
  const { spacingClasses, fontSizeClasses, textDetail } = useCognitiveSettings();

  if (!dialog) {
    return null;
  }

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    closeDialog();
  };

  const handleConfirm = async () => {
    if (dialog.onConfirm) {
      updateDialog({ isLoading: true });
      try {
        await dialog.onConfirm();
        closeDialog();
      } catch (error) {
        updateDialog({ isLoading: false });
        throw error;
      }
    } else {
      closeDialog();
    }
  };

  const handleClose = () => {
    if (!dialog.preventClose) {
      closeDialog();
    }
  };

  const contentClasses = cn(styles.content, spacingClasses.gap);
  const messageClasses = cn(styles.message, fontSizeClasses.base);
  const infoClasses = cn(styles.info, fontSizeClasses.sm);
  const actionsClasses = cn(styles.actions, spacingClasses.gap);

  const cancelLabel = dialog.cancelLabelKey
    ? textDetail.getText(dialog.cancelLabelKey)
    : textDetail.getText("button_cancel" as any);

  const confirmLabel = dialog.confirmLabelKey
    ? textDetail.getText(dialog.confirmLabelKey)
    : textDetail.getText("button_save" as any);

  return (
    <Dialog
      isOpen={!!dialog}
      onClose={handleClose}
      title={textDetail.getText(dialog.titleKey)}
      preventClose={dialog.preventClose}
      data-testid={dialog["data-testid"] || "dialog-manager"}
    >
      <div className={contentClasses}>
        <p className={messageClasses}>
          {textDetail.getText(dialog.descriptionKey)}
        </p>

        {dialog.info && (
          <div className={infoClasses}>
            {dialog.info}
          </div>
        )}

        <div className={actionsClasses}>
          {dialog.onCancel && (
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={dialog.isLoading}
              data-testid={`${dialog["data-testid"] || "dialog"}-cancel`}
            >
              <Button.Text>{cancelLabel}</Button.Text>
            </Button>
          )}
          {dialog.onConfirm && (
            <Button
              variant={dialog.confirmVariant || "primary"}
              onClick={handleConfirm}
              disabled={dialog.isLoading}
              isLoading={dialog.isLoading}
              data-testid={`${dialog["data-testid"] || "dialog"}-confirm`}
            >
              {dialog.isLoading && <Button.Loading />}
              <Button.Text>
                {dialog.isLoading
                  ? textDetail.getText("loading" as any)
                  : confirmLabel}
              </Button.Text>
            </Button>
          )}
          {!dialog.onCancel && !dialog.onConfirm && (
            <Button
              variant="primary"
              onClick={handleClose}
              data-testid={`${dialog["data-testid"] || "dialog"}-ok`}
            >
              <Button.Text>{textDetail.getText("button_save" as any)}</Button.Text>
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

DialogManager.displayName = "DialogManager";

const styles = {
  content: "flex flex-col",
  message: "text-text-primary",
  info: "text-text-secondary",
  actions: "flex justify-end gap-2 mt-4",
} as const;
