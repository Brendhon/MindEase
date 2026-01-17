/**
 * Header Component - MindEase
 * Main header for authenticated layout with cognitive accessibility support
 */
"use client";

import { Button } from "@/components/ui/button";
import { useAccessibilityClasses, useTextDetail } from "@/hooks/accessibility";
import { useAuth } from "@/hooks/auth";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useSidebar } from "@/hooks/sidebar";
import { getAccessibilityText } from "@/utils/accessibility";
import { cn } from "@/utils/ui";
import { LogOut, Menu } from "lucide-react";
import { useMemo } from "react";

export interface HeaderProps {
  title?: string;
}

export function Header({ title = "MindEase" }: HeaderProps) {
  const { signOut, isLoading } = useAuth();
  const { toggle } = useSidebar();
  const { settings } = useCognitiveSettings();
  const { getText } = useTextDetail();
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();

  // Show menu button on mobile always, or on desktop when focus mode is enabled (to access hidden sidebar)
  // In focus mode, sidebar is hidden as a distraction, so we need the button to access it

  // Get accessibility texts (always use detailed mode for aria-labels)
  const menuButtonAriaLabel = useMemo(
    () => getAccessibilityText("header_menu_open", "detailed"),
    []
  );

  const logoutButtonAriaLabel = useMemo(
    () => getAccessibilityText("header_logout_aria", "detailed"),
    []
  );

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Combine accessibility classes
  const headerClasses = useMemo(
    () => cn(
      styles.header,
      spacingClasses.padding,
      fontSizeClasses.base
    ),
    [spacingClasses.padding, fontSizeClasses.base]
  );

  const titleClasses = useMemo(
    () => cn(
      styles.title,
      fontSizeClasses.lg
    ),
    [fontSizeClasses.lg]
  );

  return (
    <header className={headerClasses} data-testid="header-container">
      <div className={cn(styles.branding, spacingClasses.gap)} data-testid="header-branding">
        {/* Menu button - visible on mobile always, or on desktop when focus mode is enabled */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn(
            // Show on mobile always (md:hidden), or on desktop when focus mode is active
            // When focus mode is active, sidebar is hidden as distraction, so button is needed
            settings.focusMode ? "" : "md:hidden"
          )}
          aria-label={menuButtonAriaLabel}
          data-testid="header-button-menu"
        >
          <Button.Icon icon={Menu} size="sm" />
        </Button>
        
        <h1 className={titleClasses} data-testid="header-title">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isLoading}
        isLoading={isLoading}
        aria-label={logoutButtonAriaLabel}
        className={styles.logoutButton}
        data-testid="header-button-logout"
      >
        {isLoading ? (
          <>
            <Button.Loading size="sm" />
            <Button.Text>{getText("header_logout_loading")}</Button.Text>
          </>
        ) : (
          <>
            <Button.Icon icon={LogOut} position="left" size="sm" />
            <Button.Text className={styles.logoutButtonText}>
              {getText("header_logout_aria")}
            </Button.Text>
          </>
        )}
      </Button>
    </header>
  );
}

const styles = {
  header: "h-16 bg-surface-primary border-b border-border-subtle flex items-center justify-between px-6",
  branding: "flex items-center gap-3",
  title: "text-lg font-semibold text-text-primary",
  logoutButton: "bg-transparent border-none p-0 m-0",
  logoutButtonIcon: "text-text-primary",
  logoutButtonText: "text-text-primary",
};

