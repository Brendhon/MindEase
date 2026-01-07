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
 *   <Sidebar.Label>Dashboard</Sidebar.Label>
 * </Sidebar.Item>
 * ```
 */
export interface SidebarIconProps {
  icon?: LucideIcon | React.ReactNode;
}

export function SidebarIcon({ icon }: SidebarIconProps) {
  if (!icon) return null;

  // Check if it's a LucideIcon component
  if (typeof icon === "function" || (icon as unknown as { render?: unknown })?.render) {
    const IconComponent = icon as LucideIcon;
    return (
      <IconComponent
        className={styles.icon}
        size={20}
        aria-hidden="true"
      />
    );
  }

  // Otherwise, treat as ReactNode
  return (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  );
}

SidebarIcon.displayName = "Sidebar.Icon";

