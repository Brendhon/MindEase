"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { cn } from "@/utils/ui/ui";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { styles, getContrastClasses } from "./sidebar-styles";
import { useSidebar } from "@/hooks/sidebar";
import { useAccessibilityClasses } from "@/hooks/accessibility";

/**
 * Sidebar.Item - Navigation item subcomponent
 * Renders a single navigation link in the sidebar
 * 
 * Automatically handles active state based on current pathname
 * Applies accessibility settings (contrast, font size, transitions) from useCognitiveSettings hook
 * 
 * @example
 * ```tsx
 * <Sidebar.Item href="/dashboard">
 *   <Sidebar.Icon icon={LayoutDashboard} />
 *   <Sidebar.Label labelKey="sidebar_dashboard" />
 * </Sidebar.Item>
 * ```
 */
export interface SidebarItemProps {
  href: string;
  label: string;
  children?: ReactNode;
  "data-testid"?: string;
}

export function SidebarItem({
  href,
  label,
  children,
  "data-testid": dataTestId,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { close } = useSidebar();
  
  // Use cognitive settings hook for automatic accessibility class generation
  // These classes automatically update when user preferences change
  const { settings } = useCognitiveSettings();
  const { fontSizeClasses, animationClasses } = useAccessibilityClasses();

  // Generate contrast classes with active state (sidebar-specific logic)
  const contrastClasses = useMemo(
    () => getContrastClasses(settings.contrast, isActive),
    [settings.contrast, isActive]
  );

  // Close sidebar on navigation (mobile behavior)
  const handleClick = () => {
    close();
  };

  return (
    <Link
      href={href}
      prefetch={true}
      onClick={handleClick}
      className={cn(
        styles.link,
        fontSizeClasses.base, // Dynamically updates: "text-sm" | "text-base" | "text-lg" based on settings.fontSize
        animationClasses, // Dynamically updates based on settings.animations
        contrastClasses
      )}
      aria-current={isActive ? "page" : undefined}
      data-testid={dataTestId || `sidebar-link-${label.toLowerCase()}`}
    >
      {children}
    </Link>
  );
}

SidebarItem.displayName = "Sidebar.Item";

