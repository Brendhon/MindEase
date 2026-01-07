"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/utils/ui/ui";
import { styles, getContrastClasses, getFontSizeClasses, getTransitionClasses } from "./sidebar-styles";
import { UserPreferences } from "@/models/UserPreferences";

/**
 * Sidebar.Item - Navigation item subcomponent
 * Renders a single navigation link in the sidebar
 * 
 * Automatically handles active state based on current pathname
 * Applies accessibility settings (contrast, font size, transitions)
 * 
 * @example
 * ```tsx
 * <Sidebar.Item href="/dashboard">
 *   <Sidebar.Icon icon={LayoutDashboard} />
 *   <Sidebar.Label>Dashboard</Sidebar.Label>
 * </Sidebar.Item>
 * ```
 */
export interface SidebarItemProps {
  href: string;
  label: string;
  contrast?: UserPreferences["contrast"];
  fontSize?: UserPreferences["fontSize"];
  animations?: boolean;
  children?: ReactNode;
  "data-testid"?: string;
}

export function SidebarItem({
  href,
  label,
  contrast = "normal",
  fontSize = "normal",
  animations = true,
  children,
  "data-testid": dataTestId,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const fontSizeClasses = getFontSizeClasses(fontSize);
  const transitionClasses = getTransitionClasses(animations);
  const contrastClasses = getContrastClasses(contrast, isActive);

  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        styles.link,
        fontSizeClasses,
        transitionClasses,
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

