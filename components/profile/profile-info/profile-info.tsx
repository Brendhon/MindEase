"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";
import { cn } from "@/utils/ui";

/**
 * ProfileInfo Component - MindEase
 * Display user information, logout and delete account buttons
 */
export interface ProfileInfoProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileInfo({ "data-testid": testId }: ProfileInfoProps) {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { fontSizeClasses, spacingClasses, textDetail } = useCognitiveSettings();

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.lg),
    [fontSizeClasses.lg]
  );

  const labelClasses = useMemo(
    () => cn(styles.label, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const valueClasses = useMemo(
    () => cn(styles.value, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  if (authLoading) {
    return (
      <div className={containerClasses} data-testid={testId || "profile-info-container"}>
        <p className={cn(styles.loading, fontSizeClasses.base)}>
          {textDetail.getText("loading")}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={containerClasses} data-testid={testId || "profile-info-container"}>
        <p className={cn(styles.error, fontSizeClasses.base)}>
          {textDetail.getText("error")}
        </p>
      </div>
    );
  }

  return (
    <div className={containerClasses} data-testid={testId || "profile-info-container"}>
      <div className={styles.section}>
        <h2 className={titleClasses} data-testid={testId ? `${testId}-title` : "profile-info-title"}>
          {textDetail.getText("profile_title")}
        </h2>
        <p className={cn(styles.description, fontSizeClasses.sm)}>
          {textDetail.getText("profile_description")}
        </p>
      </div>

      <div className={cn(styles.infoCard, spacingClasses.padding)}>
        {user.image && (
          <div className={styles.avatarContainer}>
            <img
              src={user.image}
              alt={user.name || "User avatar"}
              className={styles.avatar}
            />
          </div>
        )}

        {user.name && (
          <div className={styles.infoRow}>
            <span className={labelClasses}>Nome:</span>
            <span className={valueClasses}>{user.name}</span>
          </div>
        )}
        
        {user.email && (
          <div className={styles.infoRow}>
            <span className={labelClasses}>E-mail:</span>
            <span className={valueClasses}>{user.email}</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="md"
          onClick={() => signOut()}
          aria-label={textDetail.getText("logout")}
          data-testid={testId ? `${testId}-logout-button` : "profile-logout-button"}
        >
          <Button.Icon icon={LogOut} position="left" size="md" />
          <Button.Text>{textDetail.getText("logout")}</Button.Text>
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={() => {
            // TODO: Implement account deletion logic
            console.log("Delete account - to be implemented");
          }}
          aria-label={textDetail.getText("profile_delete_account_aria")}
          data-testid={testId ? `${testId}-delete-account-button` : "profile-delete-account-button"}
        >
          <Button.Icon icon={Trash2} position="left" size="md" />
          <Button.Text>{textDetail.getText("profile_delete_account")}</Button.Text>
        </Button>
      </div>
    </div>
  );
}

ProfileInfo.displayName = "ProfileInfo";

/**
 * ProfileInfo Styles - MindEase
 * Centralized styles for profile info component
 */

export const styles = {
  container: "flex flex-col w-full max-w-4xl mx-auto",
  section: "flex flex-col",
  title: "font-semibold text-text-primary",
  description: "text-text-secondary mt-1",
  infoCard: "flex flex-col bg-surface-primary border border-border-subtle rounded-lg gap-4",
  avatarContainer: "flex justify-center",
  infoRow: "flex flex-col gap-1",
  label: "text-text-secondary font-medium",
  value: "text-text-primary",
  avatar: "w-20 h-20 rounded-full",
  actions: "flex justify-end gap-3 mt-6",
  loading: "text-text-secondary text-center",
  error: "text-action-danger text-center",
} as const;
