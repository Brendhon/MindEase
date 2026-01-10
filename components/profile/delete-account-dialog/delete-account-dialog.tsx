"use client";

import { Button, Dialog } from "@/components/ui";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFeedback } from "@/hooks/useFeedback";
import { authService } from "@/services/auth";
import { cn } from "@/utils/ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * DeleteAccountDialog Component - MindEase
 * Accessible dialog for confirming account deletion
 */
export interface DeleteAccountDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  
  /** Callback when dialog should close */
  onClose: () => void;
  
  /** User ID to delete */
  userId: string;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function DeleteAccountDialog({
  isOpen,
  onClose,
  userId,
  "data-testid": testId,
}: DeleteAccountDialogProps) {
  const { fontSizeClasses, spacingClasses, textDetail } = useCognitiveSettings();
  const { success, error: showError } = useFeedback();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!userId) {
      showError("toast_error_account_deletion_failed");
      onClose();
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount(userId);
      success("toast_success_account_deleted");
      // Dialog will close automatically after signOut redirects
    } catch (err) {
      console.error("Error deleting account:", err);
      showError("toast_error_account_deletion_failed");
      setIsDeleting(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={textDetail.getText("profile_delete_account_dialog_title")}
      data-testid={testId || "delete-account-dialog"}
    >
      <div className={cn("flex flex-col", spacingClasses.gap)}>
        <p className={cn("text-text-secondary", fontSizeClasses.base)}>
          {textDetail.getText("profile_delete_account_dialog_message")}
        </p>
        <div className={cn("flex justify-end gap-3", spacingClasses.gap)}>
          <Button
            variant="ghost"
            size="md"
            onClick={handleClose}
            disabled={isDeleting}
            aria-label={textDetail.getText("profile_delete_account_dialog_cancel_aria")}
            data-testid={testId ? `${testId}-cancel` : "delete-account-dialog-cancel"}
          >
            <Button.Text>{textDetail.getText("profile_delete_account_dialog_cancel")}</Button.Text>
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={textDetail.getText("profile_delete_account_dialog_confirm_aria")}
            data-testid={testId ? `${testId}-confirm` : "delete-account-dialog-confirm"}
          >
            <Button.Icon icon={Trash2} position="left" size="md" />
            <Button.Text>
              {isDeleting
                ? textDetail.getText("loading")
                : textDetail.getText("profile_delete_account_dialog_confirm")}
            </Button.Text>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

DeleteAccountDialog.displayName = "DeleteAccountDialog";
