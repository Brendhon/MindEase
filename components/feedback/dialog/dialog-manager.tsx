"use client";

import { Dialog } from "@/components/ui/dialog";
import { useDialogContext } from "@/contexts/dialog-context";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { DialogActions } from "./dialog-actions";
import { DialogInfo } from "./dialog-info";
import { DialogMessage } from "./dialog-message";
import { styles } from "./dialog-manager-styles";

/**
 * DialogManager Component - MindEase
 * Renders the active dialog from the dialog context
 * Uses composition pattern with subcomponents for better testability
 */
function DialogManagerRoot() {
  const { dialog, closeDialog, updateDialog } = useDialogContext();
  const { spacingClasses, textDetail } = useCognitiveSettings();

  // Generate content classes with spacing preference
  // Must be called before any early returns to maintain Hook order
  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

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

  const dialogTestId = dialog["data-testid"] || "dialog-manager";

  return (
    <Dialog
      isOpen={!!dialog}
      onClose={handleClose}
      title={textDetail.getText(dialog.titleKey)}
      preventClose={dialog.preventClose}
      data-testid={dialogTestId}
    >
      <div className={contentClasses}>
        <DialogMessage
          messageKey={dialog.descriptionKey}
          data-testid={`${dialogTestId}-message`}
        />

        {dialog.info && (
          <DialogInfo data-testid={`${dialogTestId}-info`}>
            {dialog.info}
          </DialogInfo>
        )}

        <DialogActions
          onCancel={dialog.onCancel ? handleCancel : undefined}
          onConfirm={dialog.onConfirm ? handleConfirm : undefined}
          cancelLabelKey={dialog.cancelLabelKey}
          confirmLabelKey={dialog.confirmLabelKey}
          confirmVariant={dialog.confirmVariant}
          isLoading={dialog.isLoading}
          onClose={handleClose}
          data-testid={dialogTestId}
        />
      </div>
    </Dialog>
  );
}

DialogManagerRoot.displayName = "DialogManager";

// Compose DialogManager with subcomponents (for testing and composition)
export const DialogManager = Object.assign(DialogManagerRoot, {
  Message: DialogMessage,
  Info: DialogInfo,
  Actions: DialogActions,
});
