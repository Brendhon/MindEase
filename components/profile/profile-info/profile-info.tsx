"use client";

import { PageHeader } from "@/components/layout";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useAuth } from "@/hooks/useAuth";
import { useDialog } from "@/hooks/useDialog";
import { useFeedback } from "@/hooks/useFeedback";
import { useTextDetail } from "@/hooks/useTextDetail";
import { authService } from "@/services/auth";
import { cn } from "@/utils/ui";
import { User } from "next-auth";
import { useCallback } from "react";
import { AuthUser } from "@/contexts/auth-context";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileActions } from "./profile-actions";

/**
 * ProfileInfo Component - MindEase
 * Display user information, logout and delete account buttons
 */
export interface ProfileInfoProps {
  /** User data from server (optional, falls back to useAuth if not provided) */
  user?: User | AuthUser;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Helper function to get user ID from either User or AuthUser
 */
function getUserId(user: User | AuthUser): string | null {
  if ("id" in user) {
    return user.id;
  }
  if ("uid" in user) {
    return user.uid;
  }
  return null;
}

export function ProfileInfo({ user: userProp, "data-testid": testId }: ProfileInfoProps) {
  // Use provided user prop or fall back to useAuth for backward compatibility
  const auth = useAuth();
  const user = userProp || auth.user;
  
  const { signOut } = auth;
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();
  const { error: showError, success } = useFeedback();
  const { openDialog } = useDialog();

  const labelClasses = cn(styles.label, fontSizeClasses.sm);
  const valueClasses = cn(styles.value, fontSizeClasses.base);

  // Delete account dialog
  const deleteAccountDialog = useCallback(() => {
    if (!user) return;
    
    const userId = getUserId(user);
    if (!userId) {
      showError("toast_error_account_deletion_failed");
      return;
    }

    openDialog({
      titleKey: "profile_delete_account_dialog_title",
      descriptionKey: "profile_delete_account_dialog_message",
      cancelLabelKey: "profile_delete_account_dialog_cancel",
      confirmLabelKey: "profile_delete_account_dialog_confirm",
      confirmVariant: "danger",
      onCancel: () => {},
      onConfirm: async () => {
        try {
          await authService.deleteAccount(userId);
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
    if (!user) {
      showError("toast_error_account_deletion_failed");
      return;
    }
    
    const userId = getUserId(user);
    if (!userId) {
      showError("toast_error_account_deletion_failed");
      return;
    }
    
    deleteAccountDialog();
  }, [user, deleteAccountDialog, showError]);

  if (!user) {
    return (
      <div className={styles.container} data-testid={testId || "profile-info-container"}>
        <p className={cn(styles.error, fontSizeClasses.base)}>
          {getText("error")}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid={testId || "profile-info-container"}>
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

/**
 * ProfileInfo Styles - MindEase
 * Centralized styles for profile info component
 */

export const styles = {
  container: "flex flex-col w-full max-w-4xl mx-auto gap-6",
  label: "text-text-secondary font-medium",
  value: "text-text-primary",
  error: "text-action-danger text-center",
} as const;
