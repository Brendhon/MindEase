"use client";

import { PageHeader } from "@/components/layout";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useAuth } from "@/hooks/auth";
import { useDialog } from "@/hooks/dialog";
import { useFeedback } from "@/hooks/feedback";
import { useTextDetail } from "@/hooks/accessibility";
import { AuthUser } from "@/models/Auth";
import { authService } from "@/services/auth";
import { cn } from "@/utils/ui";
import { useCallback, useMemo } from "react";
import { ProfileActions } from "./profile-actions";
import { ProfileInfoCard } from "./profile-info-card";
import { styles } from "./profile-info-styles";

/**
 * ProfileInfo Component - MindEase
 * Display user information, logout and delete account buttons
 */
export interface ProfileInfoProps {
  /** User data from server (optional, falls back to useAuth if not provided) */
  user?: AuthUser | null;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileInfo({ user: userProp, "data-testid": testId }: ProfileInfoProps) {
  // Use provided user prop or fall back to useAuth for backward compatibility
  const auth = useAuth();
  const user = userProp || auth.user;
  
  const { signOut } = auth;
  const { fontSizeClasses, spacingClasses, animationClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();
  const { error: showError, success } = useFeedback();
  const { openDialog } = useDialog();

  // Generate accessible classes with memoization
  const labelClasses = useMemo(
    () => cn(styles.label, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );
  
  const valueClasses = useMemo(
    () => cn(styles.value, fontSizeClasses.base),
    [fontSizeClasses.base]
  );
  
  const containerClasses = useMemo(
    () => cn(
      styles.container,
      spacingClasses.gap,
      animationClasses
    ),
    [spacingClasses.gap, animationClasses]
  );
  
  const errorClasses = useMemo(
    () => cn(styles.error, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  // Delete account dialog
  const deleteAccountDialog = useCallback(() => {
    if (!user?.uid) return;
    
    openDialog({
      titleKey: "profile_delete_dialog_title",
      descriptionKey: "profile_delete_dialog_message",
      cancelLabelKey: "profile_delete_dialog_cancel",
      confirmLabelKey: "profile_delete_dialog_confirm",
      confirmVariant: "danger",
      onCancel: () => {},
      onConfirm: async () => {
        try {
          await authService.deleteAccount(user.uid);
          success("toast_success_account_deleted");
        } catch (err) {
          console.error("Error deleting account:", err);
          showError("toast_error_account_deletion_failed");
          throw err;
        }
      },
      "data-testid": testId ? `${testId}-delete-dialog` : "delete-account-dialog",
    });
  }, [user, openDialog, showError, success, testId]);

  const handleDeleteAccount = useCallback(() => {
    if (!user?.uid) {
      showError("toast_error_account_deletion_failed");
      return;
    }
    
    deleteAccountDialog();
  }, [user?.uid, deleteAccountDialog, showError]);

  if (!user) {
    return (
      <div className={containerClasses} data-testid={testId || "profile-info-container"}>
        <p className={errorClasses}>
          {getText("error")}
        </p>
      </div>
    );
  }

  return (
    <div className={containerClasses} data-testid={testId || "profile-info-container"}>
      <PageHeader
        titleKey="profile_title"
        descriptionKey="profile_description"
        data-testid={testId ? `${testId}-header` : "profile-info-header"}
      />

      <ProfileInfoCard
        user={user}
        labelClassName={labelClasses}
        valueClassName={valueClasses}
        data-testid={testId ? `${testId}-card` : "profile-info-card"}
      />

      <ProfileActions
        onLogout={() => signOut()}
        onDeleteAccount={handleDeleteAccount}
        className={spacingClasses.gap}
        data-testid={testId ? `${testId}-actions` : "profile-actions"}
      />
    </div>
  );
}

ProfileInfo.displayName = "ProfileInfo";
