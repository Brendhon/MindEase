"use client";

import { LucideIcon } from "lucide-react";
import { styles } from "./sidebar-styles";

/**
 * Sidebar.Icon - Icon subcomponent
 * Renders icons for sidebar navigation items
 * 
 * Supports both LucideIcon components and ReactNode icons
 * 
 * @example
 * ```tsx
 * <Sidebar.Item href="/dashboard">
 *   <Sidebar.Icon icon={LayoutDashboard} />
 *   <Sidebar.Label label={{ detailed: "Dashboard Overview", summary: "Dashboard" }} />
 * </Sidebar.Item>
 * ```
 */
export interface SidebarIconProps {
  icon?: LucideIcon;
}

export function SidebarIcon({ icon }: SidebarIconProps) {
  if (!icon) return null;

  // Check if it's a LucideIcon component
  const IconComponent = icon as LucideIcon;
  return (
    <IconComponent
      className={styles.icon}
      size={20}
      aria-hidden="true"
    />
  );
}

SidebarIcon.displayName = "Sidebar.Icon";

